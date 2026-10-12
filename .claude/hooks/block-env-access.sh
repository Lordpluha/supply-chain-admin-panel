#!/usr/bin/env bash
# PreToolUse hook: refuses Read/Edit/Write on env files that can hold secrets.
#
# The permission `deny` list already covers these, but a hook fails closed even
# if that list is edited, and it prints a reason instead of a bare refusal.
#
# Committed templates are explicitly allowed: `.env.example` and `.env.test`
# are part of the repository, carry placeholder values only, and are the files
# anyone setting the project up actually needs to touch.
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

name=$(basename "$file_path")

case "$name" in
  # Committed templates — no secrets by definition.
  .env.example | .env.test)
    exit 0
    ;;
  # Everything else in the family is local and may hold real values.
  .env | .env.*)
    echo "Refused: $name may hold environment secrets. Use .env.example instead." >&2
    exit 2
    ;;
esac

exit 0
