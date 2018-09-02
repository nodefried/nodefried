#!/bin/bash
# Use script location as CWD
cd "$(dirname "$0")"
# Check if the screen is running
if ! screen -list | grep -q "nodefried"; then
  # Since it wasn't running, start it
  screen -dmS nodefried /usr/bin/node init.js
fi