/**
 * listens for events on browsers tabs
 */

console.log("Background script working");

// when clicked on extensions' icon
chrome.browserAction.onClicked.addListener((tab) => {
  // sends msg to content-script
  chrome.tabs.sendMessage(tab.id, "onExtensionClicked");
});
