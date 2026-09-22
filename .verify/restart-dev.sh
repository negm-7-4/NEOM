#!/bin/bash
# Restart the local dev server for real.
#
# `kill $(cat pidfile)` only kills the npm wrapper — the `next dev` child and
# its `next-server` grandchild keep the port, the new server silently falls
# back to :3001, and every subsequent request still hits the OLD process
# (including its in-memory rate-limit and idempotency state). Kill whatever
# actually holds port 3000 instead.
LOG="/tmp/claude-0/-home-user-NEOM/c44d76a8-5a00-57e1-bbdc-9b3956087794/scratchpad/dev.log"
PIDFILE="/tmp/claude-0/-home-user-NEOM/c44d76a8-5a00-57e1-bbdc-9b3956087794/scratchpad/dev.pid"

fuser -k -TERM 3000/tcp >/dev/null 2>&1
sleep 2
fuser -k -KILL 3000/tcp >/dev/null 2>&1
sleep 1

if fuser 3000/tcp >/dev/null 2>&1; then
  echo "port 3000 still held; aborting"
  exit 1
fi

cd /home/user/NEOM || exit 1
nohup npm run dev > "$LOG" 2>&1 &
echo $! > "$PIDFILE"

for i in $(seq 1 45); do
  if grep -q "Ready in" "$LOG" 2>/dev/null && curl -s --noproxy '*' -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
    # Confirm we are talking to a *new* process, not a survivor.
    echo "dev server up — listener pid $(fuser 3000/tcp 2>/dev/null | tr -d ' ')"
    exit 0
  fi
  sleep 1
done
echo "dev server did NOT come up"
tail -20 "$LOG"
exit 1
