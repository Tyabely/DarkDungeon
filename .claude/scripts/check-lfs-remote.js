// Checks that every Git LFS file in the current commit actually reached GitHub.
// A push can upload the commits but silently skip the LFS files (2026-10-14: GitKraken did exactly that).
// Usage (repo root): node .claude/scripts/check-lfs-remote.js
// Read-only: asks GitHub's LFS API "do you have these files?", downloads nothing.

const { execSync } = require("child_process");
const git = (cmd) => execSync(`git ${cmd}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const remote = git("remote get-url origin").trim().replace(/\/?$/, "").replace(/(\.git)?$/, ".git");
const files = git("lfs ls-files -l") // lines: "<oid> <*|-> <path>"
  .trim().split("\n").filter(Boolean)
  .map((l) => { const [oid, , ...p] = l.split(" "); return { oid, path: p.join(" ") }; });

(async () => {
  const missing = [];
  for (let i = 0; i < files.length; i += 100) {
    const chunk = files.slice(i, i + 100).map((f) => ({
      oid: f.oid,
      size: Number(git(`cat-file -p "HEAD:${f.path}"`).match(/size (\d+)/)[1]),
      path: f.path,
    }));
    const res = await fetch(`${remote}/info/lfs/objects/batch`, {
      method: "POST",
      headers: { Accept: "application/vnd.git-lfs+json", "Content-Type": "application/vnd.git-lfs+json" },
      body: JSON.stringify({ operation: "download", objects: chunk.map(({ oid, size }) => ({ oid, size })) }),
    });
    if (!res.ok) { console.error(`LFS API answered ${res.status} (private repo? needs auth)`); process.exit(2); }
    const { objects } = await res.json();
    objects.forEach((o) => { if (o.error) missing.push(chunk.find((c) => c.oid === o.oid).path); });
  }
  console.log(`LFS files in HEAD: ${files.length} · on GitHub: ${files.length - missing.length} · missing: ${missing.length}`);
  missing.slice(0, 10).forEach((p) => console.log("  missing: " + p));
  if (missing.length > 10) console.log(`  …and ${missing.length - 10} more`);
  process.exit(missing.length ? 1 : 0);
})();
