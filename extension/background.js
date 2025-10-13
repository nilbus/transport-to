// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  const url = tab.url;

  // Connect to native messaging host
  const port = chrome.runtime.connectNative('com.nilbus.openincomet.native');

  // Send the URL to the native host
  port.postMessage({ url: url });

  // Handle responses (optional)
  port.onMessage.addListener((response) => {
    console.log('Received from native host:', response);
  });

  // Handle errors
  port.onDisconnect.addListener(() => {
    if (chrome.runtime.lastError) {
      console.error('Native messaging error:', chrome.runtime.lastError.message);
    }
  });
});
