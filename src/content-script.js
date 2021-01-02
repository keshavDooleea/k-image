/**
 * launches everywhere as soon as browser is opened
 * lives in html page & dom itself
 */

console.log("Content script working");
const imageContainers = [];
const PREVIEW = "k-image-preview";
const HEADER = "k-image-header";
const MAIN_CONTAINER = "k-image-main";
const MAIN_CONTAINER_ITEM = "k-image-main-item";

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
    addPreview();
    addListeners();
  }

  sendResponse({ result: "success" });
});

const addListeners = () => {
  console.log("addListeners");

  addCssStylesToHead();
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
      const isSuccess = styleImage(event, currentCounter);

      if (isSuccess) {
        chrome.storage.sync.set({ counter: currentCounter++ }, () => {});
      }
    });
  });
};

const styleImage = (event, counter) => {
  const className = `k-image-${counter}`;
  const duplicateImg = (imageItem) => imageItem.src === event.target.src;

  // prevent adding duplicate
  if (imageContainers.length > 0 && imageContainers.some(duplicateImg)) {
    return false;
  }

  // push new item
  imageContainers.push({
    className,
    src: event.target.src,
    counter,
  });

  appendToPreview(imageContainers[imageContainers.length - 1]);

  return true;
};

const addPreview = () => {
  // main container
  const container = document.createElement("div");
  container.classList.add(PREVIEW);

  // header
  const header = document.createElement("div");
  header.classList.add(HEADER);

  const title = document.createElement("h3");
  title.innerText = `Selected Images (${imageContainers.length})`;
  header.appendChild(title);

  // where each item will be inserted
  const mainContainer = document.createElement("div");
  mainContainer.classList.add(MAIN_CONTAINER);

  container.appendChild(header);
  container.appendChild(mainContainer);
  document.body.appendChild(container);
};

const appendToPreview = (imgArray) => {
  console.log(imgArray);

  // update title
  const title = document.querySelector(`.${HEADER} h3`);
  title.innerText = `Selected Images (${imageContainers.length})`;

  const main = document.querySelector(`.${MAIN_CONTAINER}`);

  // one row
  const item = document.createElement("div");
  item.classList.add(MAIN_CONTAINER_ITEM);

  const image = document.createElement("img");
  image.src = imgArray.src;

  const cross = document.createElement("div");
  cross.classList.add("cross");

  item.appendChild(image);
  item.appendChild(cross);
  main.appendChild(item);
};

// css for preview container on top as well as dom elements
const addCssStylesToHead = () => {
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
        body:not(img), *:not(img) { cursor: not-allowed !important; }
        img { cursor: pointer; }
        img:hover { filter: brightness(125%); }
        .${PREVIEW} * {
            box-sizing: border-box; 
            cursor: initial !important;
        }
        .${PREVIEW} { 
            position: absolute;
            top: 10px;
            right: 10px;
            width: 22%;
            background-color: #f2f3f7;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            padding: 5px 8px;
            overflow-y: auto;
         }
         .${HEADER} {
             width: 100%;
             height: 40px;
             display: grid;
             place-content: center;
         }
         .${MAIN_CONTAINER} {
             width: 100%;
             display: flex;
             flex-direction: column;
         }
         .${MAIN_CONTAINER_ITEM} {
             width: 100%;
             height: 75px;
             display: grid;
             grid-template-columns: 75% 25%;
             grid-template-rows: 100%;
             grid-gap-column: 10px;
             background: #f2f3f7;
             border-radius: 5px;
             padding: 5px 8px;
             box-shadow: -6px -6px 8px rgba(255, 255, 255, 0.9), 5px 5px 8px rgba(0, 0, 0, 0.07);
         }
         .${MAIN_CONTAINER_ITEM}:not(:nth-child(1)) {
             margin-top: 10px;
         }
         .${MAIN_CONTAINER_ITEM} img {
             max-width: 100%;
             max-height: 100%;
             justify-self: center;
             cursor: initial !important;
         }
         .${MAIN_CONTAINER_ITEM} img:hover {
            filter: brightness(100%);
         }
         .cross {
            display: grid;
            place-content: center;
            position: relative;
         }
         .cross::before {
             content: "X";
             width: 28px;
             height: 28px;
             position: absolute;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             background-color: #f2f3f7;
             border-radius: 50%;
             box-shadow: -6px -6px 8px rgba(255, 255, 255, 0.9), 5px 5px 8px rgba(0, 0, 0, 0.07);
             display: grid;
             place-content: center;
             cursor: pointer;
         }
    </style>`
  );
};
