# Open in Comet

A Chrome extension for Arc browser that opens the current page in Comet browser.

## Features

- Click the extension icon to open the current page in Comet browser
- Uses native messaging to communicate with macOS
- Works in Arc browser (Chromium-based)

## Prerequisites

- Arc browser installed at `/Applications/Arc.app/`
- Comet browser installed
- `jq` command-line tool (install with `brew install jq`)

## Installation

### 1. Run the setup script

```bash
./bin/setup
```

This will:
- Check prerequisites (Arc browser, `jq`)
- Make the native host script executable
- Install the native messaging host manifest to Arc's directory

### 2. Load the extension in Arc

1. Open Arc browser and navigate to `arc://extensions`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `extension` directory from this project

> **Note**: This extension uses a public key in `manifest.json` to generate a consistent extension ID. The ID will be the same every time you load it, so no additional configuration is needed.

## Usage

1. Browse to any page in Arc browser
2. Click the Comet icon in the extensions toolbar
3. The page will open in Comet browser

## Testing

You can test the native messaging host without loading the extension:

```bash
# Test with default URL
./bin/test

# Test with a specific URL
./bin/test "https://example.com"
```

This script sends a properly formatted native messaging message to the host script, simulating what the browser extension does.

## Troubleshooting

### Extension doesn't appear

- Make sure you've loaded the unpacked extension correctly
- Check that Developer mode is enabled in Arc

### Nothing happens when clicking the icon

- Open the extension's service worker console (click "service worker" link on the extensions page)
- Check for error messages
- Common issues:
  - Native host manifest not installed (run `./bin/setup` again)
  - Native host script not executable (`chmod +x native-host/open-in-comet-host.sh`)
  - `jq` not installed (`brew install jq`)
  - Check native host manifest is in the correct location: `~/Library/Application Support/Arc/NativeMessagingHosts/com.nilbus.openincomet.native.json`

### Comet doesn't open

- Verify Comet browser is installed and accessible
- Try running manually: `open -a Comet "https://example.com"`

## Development

### Project Structure

```
open-in-comet/
├── extension/           # Chrome extension
│   ├── manifest.json   # Extension manifest (V3) with public key
│   ├── background.js   # Service worker
│   └── comet.png       # Extension icon
├── native-host/        # Native messaging host
│   ├── open-in-comet-host.sh              # Bash script
│   └── com.nilbus.openincomet.native.json # Host manifest
├── bin/
│   ├── setup          # Installation script
│   └── test           # Test script for native messaging host
├── extension-key.pem   # Private key (gitignored, do not commit)
└── README.md
```

### Extension Key

The extension includes a public key in `manifest.json` that ensures a **consistent extension ID** across installations. This solves the chicken-and-egg problem where the native host manifest needs the extension ID before the extension is loaded.

- **Private key** (`extension-key.pem`): Keep this secure, it's gitignored
- **Public key**: Already embedded in `manifest.json`
- The extension ID is deterministically derived from the public key

## How It Works

Chrome extensions cannot directly execute terminal commands due to browser sandboxing. This extension uses Chrome's **Native Messaging API**:

1. Extension captures the current tab's URL
2. Sends URL to native messaging host via `chrome.runtime.connectNative()`
3. Bash script receives the message via stdin (native messaging protocol)
4. Script executes `open -a Comet "<url>"`
5. Comet browser opens with the URL

The native host is **not** a long-running process—Chrome starts it when needed and it exits immediately after processing the message.

## License

MIT No Attribution License (MIT-0)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
