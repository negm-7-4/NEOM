#!/bin/bash
LOG="/tmp/claude-0/-home-user-NEOM/c44d76a8-5a00-57e1-bbdc-9b3956087794/scratchpad/prod.log"
fuser -k -TERM 3000/tcp >/dev/null 2>&1; sleep 2
fuser -k -KILL 3000/tcp >/dev/null 2>&1; sleep 1
cd /home/user/NEOM || exit 1
nohup npm run start > "$LOG" 2>&1 &
for i in $(seq 1 45); do
  if curl -s --noproxy '*' -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
    echo "prod server up (listener $(fuser 3000/tcp 2>/dev/null | tr -d ' '))"; exit 0
  fi
  sleep 1
done
echo "did not start"; tail -20 "$LOG"; exit 1
