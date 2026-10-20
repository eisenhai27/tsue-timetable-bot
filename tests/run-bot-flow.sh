#!/usr/bin/env bash
# Runs tests/bot-flow.mjs against a FRESH local Worker + database, a static copy of docs/ (the "GitHub Pages" site)
# and a fake Telegram (tests/mock-telegram.mjs). Needs the ports from .dev.vars: 1236 (site), 8790 (Telegram), 8787 (Worker).
set -u
cd "$(dirname "$0")/.."
pkill -x workerd 2>/dev/null; pkill -f "[w]rangler dev" 2>/dev/null; pkill -f "[h]ttp.server 1236" 2>/dev/null; pkill -f "[m]ock-telegram" 2>/dev/null
sleep 1
rm -rf .wrangler/state
PIDS=()
cleanup() { for p in "${PIDS[@]}"; do kill "$p" 2>/dev/null; done; pkill -x workerd 2>/dev/null; }
trap cleanup EXIT
python3 -m http.server 1236 --directory docs >/dev/null 2>&1 & PIDS+=($!)
node tests/mock-telegram.mjs >/dev/null 2>&1 & PIDS+=($!)
npx wrangler dev --port 8787 --ip 127.0.0.1 --var FLOOD_MAX:100000 >"${TMPDIR:-/tmp}/wrangler-test.log" 2>&1 & PIDS+=($!)
for i in $(seq 1 60); do curl -s localhost:8787/ >/dev/null && break; sleep 1; done
node tests/bot-flow.mjs
node tests/notify-dedupe.mjs
node tests/security.mjs
node tests/broadcast.mjs
# the same Worker, now with the separate admin bot configured
pkill -x workerd 2>/dev/null; sleep 1
npx wrangler dev --port 8787 --ip 127.0.0.1 --var FLOOD_MAX:100000 --var ADMIN_BOT_TOKEN:admintoken123 >"${TMPDIR:-/tmp}/wrangler-test2.log" 2>&1 & PIDS+=($!)
for i in $(seq 1 60); do curl -s localhost:8787/ >/dev/null && break; sleep 1; done
node tests/admin-bot.mjs
