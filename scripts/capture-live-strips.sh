#!/usr/bin/env bash
# Capture viewport screenshots of the live app page at fixed scroll steps.
# Usage: capture-live-strips.sh <session-name> <out-prefix> <total-height> <step>
set -u
SESSION="${1:-default}"
PREFIX="${2:-strip}"
TOTAL="${3:-12460}"
STEP="${4:-800}"
i=0
for ((y = 0; y < TOTAL; y += STEP)); do
  agent-browser --session "$SESSION" eval "window.scrollTo(0, $y)" > /dev/null 2>&1
  sleep 2.2
  agent-browser --session "$SESSION" screenshot "${PREFIX}-$(printf '%03d' $i).png" > /dev/null 2>&1
  echo "captured ${PREFIX}-$(printf '%03d' $i).png at y=$y"
  i=$((i + 1))
done
agent-browser --session "$SESSION" eval "window.scrollTo(0, 0)" > /dev/null 2>&1
