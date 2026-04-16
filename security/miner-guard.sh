#!/bin/bash
# ============================================================
# miner-guard.sh — Anti-cryptominer agent
# Runs every 5 min via cron. Kills miners, blocks C2s, alerts.
# ============================================================

LOG="/var/log/miner-guard.log"
ALERT_EMAIL="${ALERT_EMAIL:-}"          # set in env or edit here
TELEGRAM_TOKEN="${TELEGRAM_TOKEN:-}"    # optional
TELEGRAM_CHAT="${TELEGRAM_CHAT:-}"      # optional

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG"; }

alert() {
  local msg="$1"
  log "ALERT: $msg"

  # Telegram alert
  if [ -n "$TELEGRAM_TOKEN" ] && [ -n "$TELEGRAM_CHAT" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT}" \
      -d "text=🚨 [$(hostname)] MINER GUARD: $msg" \
      -d "parse_mode=HTML" > /dev/null 2>&1
  fi

  # Email alert (requires sendmail/postfix)
  if [ -n "$ALERT_EMAIL" ]; then
    echo "Subject: [MINER GUARD] $msg" | sendmail "$ALERT_EMAIL" 2>/dev/null
  fi
}

# ── 1. Known miner process patterns ──────────────────────────
MINER_PATTERNS=(
  "npm_update" "md0Zewf" "gYTBUnd" "cX86" "cARM"
  "GMeKNtd" "H1AE34" "9HhtmE0" "elcEZbs" "TDUh"
  "xmrig" "xmr-stak" "minerd" "cpuminer"
  "kdevtmpfsi" "kinsing" "kworkerds"
)

# ── 2. Known C2 / mining pool IPs ────────────────────────────
BLOCK_IPS=(
  "31.220.80.26"
  "107.175.89.136"
  "45.9.148.0/24"
  "194.165.16.0/24"
)

# ── 3. Suspicious CPU threshold (%) ──────────────────────────
CPU_THRESHOLD=80

killed=0

# Kill known miner processes
for pattern in "${MINER_PATTERNS[@]}"; do
  pids=$(pgrep -f "$pattern" 2>/dev/null)
  if [ -n "$pids" ]; then
    kill -9 $pids 2>/dev/null
    alert "Killed miner process: $pattern (PIDs: $pids)"
    killed=$((killed + 1))
  fi
done

# Kill any process using >80% CPU that isn't a known good process
while IFS= read -r line; do
  pid=$(echo "$line" | awk '{print $1}')
  cpu=$(echo "$line" | awk '{print $2}' | cut -d. -f1)
  cmd=$(echo "$line" | awk '{print $11}')

  # Skip known good processes
  case "$cmd" in
    *node*|*next*|*nginx*|*sshd*|*systemd*|*pm2*|*tsx*|*python*|*bash*|*sh*) continue ;;
  esac

  if [ "$cpu" -ge "$CPU_THRESHOLD" ] 2>/dev/null; then
    kill -9 "$pid" 2>/dev/null
    alert "Killed high-CPU process: $cmd (PID: $pid, CPU: ${cpu}%)"
    killed=$((killed + 1))
  fi
done < <(ps aux --no-headers | awk '{print $2, $3, $11}')

# Block C2 IPs
for ip in "${BLOCK_IPS[@]}"; do
  if ! iptables -C OUTPUT -d "$ip" -j DROP 2>/dev/null; then
    iptables -A OUTPUT -d "$ip" -j DROP
    iptables -A INPUT -s "$ip" -j DROP
    log "Blocked C2 IP: $ip"
  fi
done

# Remove known miner binaries from common drop locations
MINER_PATHS=(
  /tmp/npm_update /tmp/let /tmp/systemd-logind
  /dev/shm/let /var/let /etc/let /let
  /GMeKNtd /TDUh /elcEZbs /H1AE34 /9HhtmE0
  /etc/de/cX86 /etc/de/cARM
)
for f in "${MINER_PATHS[@]}"; do
  if [ -f "$f" ]; then
    rm -f "$f"
    alert "Removed miner binary: $f"
    killed=$((killed + 1))
  fi
done

# Check crontab for malicious entries
if crontab -l 2>/dev/null | grep -qE 'var/tmp|systemd-logind|config\.json|nc [0-9]|curl.*sh|wget.*sh'; then
  crontab -l 2>/dev/null | grep -vE 'var/tmp|systemd-logind|config\.json|nc [0-9]|curl.*sh|wget.*sh' | crontab -
  alert "Cleaned malicious crontab entries"
fi

# Check .bashrc for malicious entries
if grep -qE 'nohup.*cX86|nohup.*cARM|nohup.*var/tmp|/etc/de/' /root/.bashrc 2>/dev/null; then
  sed -i '/nohup.*cX86/d; /nohup.*cARM/d; /nohup.*var\/tmp/d; /\/etc\/de\//d' /root/.bashrc
  alert "Cleaned malicious .bashrc entries"
fi

# Check authorized_keys for unknown keys (keep only known fingerprints)
# Known good: s/r72ng64pE, UOAgOCTVZV2, y3xHeeB5eCK, cfoRAQWB+Pv, oaBnKYClLzFj
KNOWN_KEYS=5
current_keys=$(wc -l < /root/.ssh/authorized_keys 2>/dev/null || echo 0)
if [ "$current_keys" -gt "$KNOWN_KEYS" ]; then
  alert "WARNING: authorized_keys has $current_keys keys (expected $KNOWN_KEYS) — check manually!"
fi

if [ "$killed" -gt 0 ]; then
  log "Cleaned $killed threats"
else
  log "Clean — no threats found"
fi
