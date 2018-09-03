#!/bin/bash
# Use script location as CWD
cd "$(dirname "$0")"

# Check for screen and Node
if [ -x "$(command -v node)" ]; then
  if [ -x "$(command -v screen)" ]; then
    # Check if the screen is running
    if ! screen -list | grep -q "nodefried"; then
      # Since it wasn't running, start it
      screen -dmS nodefried /usr/bin/node init.js
    fi
  fi
fi
