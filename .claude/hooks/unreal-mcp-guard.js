// PreToolUse guard for mcp__unreal-mcp__call_tool.
// Mentor rule: Claude may only READ from the Unreal editor, never change it.
// Every editor function is reached through call_tool, so settings.json deny rules
// can't tell them apart — this script checks the function name instead.
// Anything not recognised as read-only is denied (allowlist, fail closed).

const READ_PREFIXES = [
  "get", "list", "find", "read", "is", "has", "can", "search", "exists",
  "describe", "query", "validate",
];

// Write words that must not appear AFTER the first word (catches "find_or_create_track").
const WRITE_WORDS = new Set([
  "create", "add", "remove", "delete", "write", "update", "save", "execute",
  "run", "apply", "spawn", "import", "export", "bake", "compile", "move",
]);

// Read-only tools whose names don't follow the rules above.
const EXTRA_ALLOW = new Set([
  "list_toolsets", "describe_toolset",          // top-level discovery
  "uenum_info", "trace_world",                  // lookups
  "worldpostoscreencoords", "screencoordstoworld",
  "captureviewport", "captureeditorimage", "captureassetimage", // screenshots
  "snapshot", "screenshot", "waitfor", "observe", "unobserve", // Slate: look, don't touch
  "get_create_event_function",                  // reads despite "create"/"compile" in the name
  "getsystemcompilestate",
]);

// Never allowed, even if a rule above would match.
const ALWAYS_DENY = new Set([
  "execute_tool_script", "get_execution_environment", "find_or_create_track",
]);

// "find_or_create_track" -> [find, or, create, track]; "GetAttributeSetClasses" -> [get, attribute, set, classes]
function words(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[_\W]+/)
    .filter(Boolean);
}

function decide(fn) {
  const lower = fn.toLowerCase();
  if (ALWAYS_DENY.has(lower)) return "denied explicitly";
  if (EXTRA_ALLOW.has(lower)) return null;
  const w = words(fn);
  if (!READ_PREFIXES.includes(w[0])) return "does not start with a read verb";
  const bad = w.slice(1).find((x) => WRITE_WORDS.has(x));
  if (bad) return `contains write word "${bad}"`;
  return null;
}

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        `Unreal MCP is read-only for Claude (mentor rule). ${reason}. ` +
        `Describe the step for the user to do in the editor instead.`,
    },
  }));
  process.exit(0);
}

if (require.main === module) {
  let raw = "";
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    let fn;
    try {
      const input = JSON.parse(raw).tool_input || {};
      // tool_name may be short ("find_actors") or fully qualified ("...SceneTools.find_actors")
      fn = String(input.tool_name || "").split(".").pop().trim();
    } catch (e) {
      return deny(`Guard could not read the request (${e.message})`);
    }
    if (!fn) return deny("No tool name given");
    const why = decide(fn);
    if (why) return deny(`"${fn}" blocked: ${why}`);
    process.exit(0); // read-only: let the normal permission flow continue
  });
}

module.exports = { decide };
