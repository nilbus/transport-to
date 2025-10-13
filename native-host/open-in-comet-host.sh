#!/usr/bin/env bash

# Native messaging host for Open in Comet extension
# Reads a message from stdin and opens the URL in Comet browser

# Read the message length (4 bytes, little-endian unsigned integer)
read_length() {
  local length_bytes
  length_bytes=$(dd bs=1 count=4 2>/dev/null | od -An -tu4)
  echo "$length_bytes" | tr -d ' '
}

# Read the JSON message
read_message() {
  local length=$1
  dd bs=1 count="$length" 2>/dev/null
}

# Send a response back to the extension
send_message() {
  local message=$1
  local length=${#message}

  # Send length as 4-byte little-endian unsigned integer
  printf $(printf '\\x%02x' $((length & 0xFF)) $(((length >> 8) & 0xFF)) $(((length >> 16) & 0xFF)) $(((length >> 24) & 0xFF)))

  # Send the message
  printf '%s' "$message"
}

# Main logic
main() {
  # Read the message from the extension
  local length
  length=$(read_length)

  if [ -z "$length" ] || [ "$length" -eq 0 ]; then
    exit 0
  fi

  local message
  message=$(read_message "$length")

  # Extract URL from JSON message using jq
  local url
  url=$(echo "$message" | jq -r '.url')

  # Open URL in Comet browser
  if [ -n "$url" ]; then
    open -a Comet "$url"

    # Send success response
    send_message '{"status":"success"}'
  else
    # Send error response
    send_message '{"status":"error","message":"No URL provided"}'
  fi
}

main
