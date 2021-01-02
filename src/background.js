/**
 * listens for events on browsers tabs
 */

console.log("Background script workingg");

// when clicked on extensions' icon
chrome.browserAction.onClicked.addListener((tab) => {
  // sends msg to content-script
  chrome.tabs.sendMessage(tab.id, "onExtensionClicked");
});

// initial storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ hide: true }, () =>
    console.log("hide image is true")
  );
});
