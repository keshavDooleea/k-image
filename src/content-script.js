/**
 * launches everywhere as soon as browser is opened
 * lives in html page & dom itself
 */

console.log("Content script working");

//on init perform based on chrome stroage value
window.onload = function () {
  //   chrome.storage.sync.get("counter", (data) => {
  //     // data.counter > 0 ? addListeners() : removeListeners();
  //   });
};

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request === "onExtensionClicked") {
//     console.log("Clicked");
//     addListeners();
//   }
// });

//message listener for background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "onExtensionClicked") {
  }

  if (request.command === "onPopUpInit") {
    addListeners();
  }

  sendResponse({ result: "success" });
});

const addListeners = () => {
  console.log("addListeners");
  addStylesToBody();
  let currentCounter;
  const allImages = document.querySelectorAll("body img");
  const body = document.querySelector("body");

  chrome.storage.sync.get("counter", (data) => (currentCounter = data.counter));

  // remove all click listeners on other dom elements
  body.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() !== "img") return;
  });

  // add specific listener on each image
  allImages.forEach((img) => {
    img.addEventListener("click", (event) => {
      img.classList.add("hide");

      chrome.storage.sync.set({ counter: currentCounter++ }, () => {
        console.log("The counter is " + currentCounter);
      });
    });
  });
};

const removeListeners = () => {
  console.log("removed listeners");
};

const addStylesToBody = () => {
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
        body:not(img), *:not(img) { cursor: not-allowed !important; }
        img { cursor: pointer; }
        img:hover { filter: brightness(125%); }
        .hide { display:none; }
    </style>`
  );
};
