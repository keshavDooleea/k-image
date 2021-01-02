/**
 * launches everywhere as soon as browser is opened
 * lives in html page & dom itself
 */

console.log("Content script working");

//on init perform based on chrome stroage value
window.onload = function () {
  chrome.storage.sync.get("hide", function (data) {
    data.hide ? addListeners() : removeListeners();
  });
};

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request === "onExtensionClicked") {
//     let images = document.querySelectorAll("img");

//     for (img of images) {
//       console.log(img);
//     }
//   }
// });

//message listener for background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  request.command === "init" ? addListeners() : removeListeners();

  sendResponse({ result: "success" });
});

const addListeners = () => {
  console.log("added listeners");
};

const removeListeners = () => {
  console.log("removed listeners");
};
