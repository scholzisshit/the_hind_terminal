#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  BHARAT MONITOR — START SCRIPT (this script is about to be iconic fr 🚀)
#  Launches all three services in parallel (we're serving a whole tech stack meal):
#    - bharat-ai  (Python FastAPI, port 8000) - the brain cell of the operation 🧠
#    - bharat-core (Rust Axum, port 8080) - blazingly fast bestie ⚡
#    - bharat-ui  (Next.js, port 3000) - pretty face of the group 💅
# ─────────────────────────────────────────────────────────────

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'

banner() { echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
info()   { echo -e "${GREEN}[BHARAT]${NC} $1"; }
warn()   { echo -e "${YELLOW}[WARN]${NC} $1"; }

banner
echo -e "${CYAN}  BHARAT MONITOR — OMNI-STACK LAUNCH${NC}"
echo -e "${CYAN}  AI · Rust WebSocket Broker · Next.js Frontend${NC}"
banner

# Kill existing processes on our ports (sorry not sorry to whoever was squatting 😤)
for PORT in 8000 8080 3000; do
  PID=$(lsof -ti:$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    warn "Killing existing process on port $PORT (PID: $PID) - you've been evicted bestie 💪"
    kill -9 $PID 2>/dev/null || true
  fi
done

mkdir -p "$ROOT/logs"

# ── 1. Python AI Pipeline ──────────────────────────────
info "Starting bharat-ai (FastAPI, port 8000) - about to serve some premium data 🍳"
cd "$ROOT/bharat-ai"
if [ ! -d "venv" ]; then
  info "Creating Python virtual environment..."
  python3 -m venv venv
fi
source venv/bin/activate
info "Installing Python dependencies..."
pip install -q -r requirements.txt
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --log-level warning > "$ROOT/logs/bharat-ai.log" 2>&1 &
AI_PID=$!
info "bharat-ai started (PID: $AI_PID)"

# Wait for Python to be ready
sleep 2
if ! curl -sf http://localhost:8000/ > /dev/null 2>&1; then
  warn "bharat-ai may not be ready yet (continuing...)"
fi

# ── 2. Rust Telemetry Broker ──────────────────────────────
info "Starting bharat-core (Rust Axum, port 8080)..."
cd "$ROOT/bharat-core"
if ! command -v cargo &> /dev/null; then
  warn "Cargo not found — bharat-core will be skipped. Frontend will use simulation fallback."
else
  nohup cargo run --release > "$ROOT/logs/bharat-core.log" 2>&1 &
  RUST_PID=$!
  info "bharat-core building/starting (PID: $RUST_PID)"
fi

# ── 3. Next.js Frontend ───────────────────────────────────
info "Starting bharat-ui (Next.js, port 3000)..."
cd "$ROOT/bharat-ui"
if [ ! -d "node_modules" ]; then
  info "Installing npm dependencies..."
  npm install
fi
nohup npm run dev > "$ROOT/logs/bharat-ui.log" 2>&1 &
UI_PID=$!
info "bharat-ui started (PID: $UI_PID)"

# ── Summary ───────────────────────────────────────────────
banner
echo -e "${GREEN}  ✓ bharat-ai  → http://localhost:8000${NC}"
echo -e "${GREEN}  ✓ bharat-core → ws://localhost:8080/ws/live${NC}"
echo -e "${GREEN}  ✓ bharat-ui  → http://localhost:3000${NC}"
banner
echo ""
echo -e "  Logs: $ROOT/logs/"
echo -e "  Press ${RED}Ctrl+C${NC} to stop all services"
echo ""

# Wait and tail logs
wait_and_open() {
  sleep 5
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    info "Frontend ready! Opening http://localhost:3000"
    open "http://localhost:3000" 2>/dev/null || true
  fi
}
wait_and_open &

# Keep running; Ctrl+C kills all children
trap 'echo -e "\n${RED}Stopping all services...${NC}"; kill 0; exit 0' INT
wait
