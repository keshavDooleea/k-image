/**
 * launches everywhere as soon as browser is opened
 * lives in html page & dom itself
 */

console.log("Content script working");
const imageContainers = [];

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

// message listener for background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

  // prevent click listeners on all dom elements except images
  body.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() !== "img") return;
  });

  // add specific listener on each image
  allImages.forEach((img) => {
    img.addEventListener("click", (event) => {
      chrome.storage.sync.set({ counter: currentCounter++ }, () => {
        styleImage(img, event, currentCounter);
      });
    });
  });
};

const styleImage = (img, event, counter) => {
  const className = `k-image-${counter}`;

  console.log(img, event);

  if (imageContainers.includes(className)) return;

  imageContainers.push(className);
  const container = document.createElement("div");
  container.classList.add(className);
  container.style.cssText = `position:absolute; width: ${img.width}px; height: ${img.height}px;
                            z-index: 10000; top: ${event.clientY}px; left: ${event.clientX}px;
                            transform: translate(-50%, -50%); background: red;`;
  document.body.appendChild(container);
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
