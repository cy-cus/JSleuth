chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "scanResults") {
    chrome.storage.local.set({ scanResults: message.data });
  }
});
