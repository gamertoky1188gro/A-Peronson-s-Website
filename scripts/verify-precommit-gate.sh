#!/usr/bin/env bash
# Proves the pre-commit test gate can fail - and that the previous form could
# not.
#
# The gate is extracted from .husky/pre-commit verbatim and run with a stub
# `npm` on PATH, so the behaviour under test is the hook's own code and not a
# re-implementation of it. The stub prints what a red suite prints ("FAIL" and
# a "Tests:" line) and exits with npm's status.
#
#   scripts/verify-precommit-gate.sh
#
# Exit status 0 means: the new gate fails a red suite, passes a green one, and
# the old gate passed a red suite.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK="$ROOT/.husky/pre-commit"
SH_BIN="/bin/sh"

if [ ! -f "$HOOK" ]; then
  echo "no hook at $HOOK"
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Extract the test step of the hook: from the "2. Running Tests" line up to the
# line before "3. Running Build".
START=$(grep -n '^echo "2\. Running Tests' "$HOOK" | cut -d: -f1)
END=$(grep -n '^echo "3\. Running Build' "$HOOK" | cut -d: -f1)
if [ -z "$START" ] || [ -z "$END" ]; then
  echo "could not locate the test step in $HOOK"
  exit 1
fi
sed -n "${START},$((END - 1))p" "$HOOK" > "$WORK/gate-new.sh"

# The gate as it was before the fix, for the comparison.
cat > "$WORK/gate-old.sh" <<'OLDGATE'
echo "2. Running Tests..."
npm test 2>&1 | grep -E "(PASS|FAIL|Tests:)"
if [ $? -ne 0 ]; then
  echo "Tests failed!"
  exit 1
fi
OLDGATE

make_stub_npm() {
  local dir="$1"
  local exit_code="$2"
  mkdir -p "$dir"
  cat > "$dir/npm" <<EOF
#!/bin/sh
# A red suite still prints FAIL and a Tests: line, exactly like the real one.
echo "FAIL tests/unit/example.test.js"
echo "Tests:       1 failed, 20 passed, 21 total"
exit $exit_code
EOF
  chmod +x "$dir/npm"
}

run_gate() {
  local gate_file="$1"
  local stub_dir="$2"
  local out_file="$3"
  (cd "$ROOT" && PATH="$stub_dir:$PATH" "$SH_BIN" -e "$gate_file" > "$out_file" 2>&1)
  echo $?
}

make_stub_npm "$WORK/red" 1
make_stub_npm "$WORK/green" 0

echo "=== extracted gate"
cat "$WORK/gate-new.sh"

echo ""
echo "=== 1. the NEW gate with a RED suite (npm exits 1)"
new_red_status=$(run_gate "$WORK/gate-new.sh" "$WORK/red" "$WORK/red-out.txt")
echo "gate exit status: $new_red_status"
tail -3 "$WORK/red-out.txt"

echo ""
echo "=== 2. the NEW gate with a GREEN suite (npm exits 0)"
new_green_status=$(run_gate "$WORK/gate-new.sh" "$WORK/green" "$WORK/green-out.txt")
echo "gate exit status: $new_green_status"
tail -3 "$WORK/green-out.txt"

echo ""
echo "=== 3. the OLD gate with the same RED suite (npm exits 1)"
old_red_status=$(run_gate "$WORK/gate-old.sh" "$WORK/red" "$WORK/old-red-out.txt")
echo "gate exit status: $old_red_status"
tail -3 "$WORK/old-red-out.txt"

echo ""
echo "=== verdict"
if [ "$new_red_status" -ne 0 ] && [ "$new_green_status" -eq 0 ] && [ "$old_red_status" -eq 0 ]; then
  echo "PASS: the new gate fails a red suite and passes a green one; the old gate passed a red suite."
  exit 0
fi
echo "FAIL: new_red=$new_red_status new_green=$new_green_status old_red=$old_red_status"
exit 1
