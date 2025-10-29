// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-in-dia',
    title: 'Dia',
    contexts: ['page', 'link']
  });

  chrome.contextMenus.create({
    id: 'open-in-comet',
    title: 'Comet',
    contexts: ['page', 'link']
  });

  chrome.contextMenus.create({
    id: 'open-in-chrome',
    title: 'Chrome',
    contexts: ['page', 'link']
  });

  chrome.contextMenus.create({
    id: 'open-in-firefox',
    title: 'Firefox',
    contexts: ['page', 'link']
  });
});

// Helper function to open URL in specified app
function openInApp(url, app) {
  // Connect to native messaging host
  const port = chrome.runtime.connectNative('com.nilbus.transportto.native');

  // Send the URL and app name to the native host
  port.postMessage({ url: url, app: app });

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
}

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Use link URL if available, otherwise use page URL
  const url = info.linkUrl || info.pageUrl;

  if (info.menuItemId === 'open-in-dia') {
    openInApp(url, 'Dia');
  } else if (info.menuItemId === 'open-in-comet') {
    openInApp(url, 'Comet');
  } else if (info.menuItemId === 'open-in-chrome') {
    openInApp(url, 'Google Chrome');
  } else if (info.menuItemId === 'open-in-firefox') {
    openInApp(url, 'Firefox');
  }
});

// Listen for clicks on the extension icon (default: Comet)
chrome.action.onClicked.addListener((tab) => {
  const url = tab.url;
  openInApp(url, 'Comet');
});
