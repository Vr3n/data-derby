#!/bin/bash


# Create a new Tmux window and start the debuggers.
tmux new-window -n debuggers

# Start fastapi server.
tmux send-keys "cd backend && uv run uvicorn app.main:app --reload" C-m

# Create horizontal window.
tmux split-window


# Start react server.
tmux send-keys "cd frontend && pnpm run dev" C-m
