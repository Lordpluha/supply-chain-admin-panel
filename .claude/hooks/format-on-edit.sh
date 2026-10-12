#!/usr/bin/env bash
# PostToolUse hook: runs `biome format --write` on the file just edited, so
# formatting is fixed immediately rather than surfacing at the lefthook stage.
set -euo pipefail

if command -v jq >/dev/null 2>&1; then
  file_path=$(jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")
else
  file_path=$(node -e '
let data = "";
process.stdin.on("data", c => (data += c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(data);
    process.stdout.write(input.tool_input?.file_path ?? "");
  } catch {
    process.stdout.write("");
  }
});
')
fi

[ -n "$file_path" ] || exit 0

case "$file_path" in
  *node_modules/*|*/dist/*|*/.output/*|*/storybook-static/*|*routeTree.gen.ts) exit 0 ;;
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css) ;;
  *) exit 0 ;;
esac

[ -f "$file_path" ] || exit 0

repo_root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
biome_bin="$repo_root/node_modules/.bin/biome"

[ -x "$biome_bin" ] || exit 0

"$biome_bin" format --write "$file_path" >/dev/null 2>&1 || true

exit 0
