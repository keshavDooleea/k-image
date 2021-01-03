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
const ACTION_CONTAINER = "k-image-actions";

// message listener for background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "onPopUpInit") {
    addPreview();
    addListeners();
  }

  sendResponse({ result: "success" });
});

const addPreview = () => {
  // main container
  const container = document.createElement("div");
  container.classList.add(PREVIEW);

  // header
  const header = document.createElement("div");
  header.classList.add(HEADER);

  const title = document.createElement("h3");
  title.innerText = `Selected Images (0)`;
  header.appendChild(title);

  // where each item will be inserted
  const mainContainer = document.createElement("div");
  mainContainer.classList.add(MAIN_CONTAINER);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add(ACTION_CONTAINER);
  actionContainer.style.display = "none";
  const button = document.createElement("button");
  button.innerText = "Download All";
  actionContainer.appendChild(button);

  container.appendChild(header);
  container.appendChild(mainContainer);
  container.appendChild(actionContainer);
  document.body.appendChild(container);
};

const addListeners = () => {
  addCssStylesToHead();
  const allImages = document.querySelectorAll("body img");
  const body = document.querySelector("body");

  // prevent click listeners on all dom elements except images
  body.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() !== "img") return;
  });

  // add specific listener on each image
  allImages.forEach((img) => {
    img.addEventListener("click", (event) => {
      appendToPreview(event);
    });
  });
};

const appendToPreview = (event) => {
  // prevent adding duplicate
  if (containsDuplicate(event.target.src)) {
    return;
  }

  const main = document.querySelector(`.${MAIN_CONTAINER}`);

  // one row
  const item = document.createElement("div");
  item.classList.add(MAIN_CONTAINER_ITEM);

  const image = document.createElement("img");
  image.src = event.target.src;

  const cross = document.createElement("div");
  cross.classList.add("cross");
  cross.addEventListener("click", (crossEvent) => {
    deleteItem(crossEvent.target.parentElement);
  });

  item.appendChild(image);
  item.appendChild(cross);

  main.appendChild(item);
  updateTitle();
};

const containsDuplicate = (currentSource) => {
  const duplicateImg = (imageElement) => imageElement.src === currentSource;
  const items = Array.from(
    document.querySelectorAll(`.${MAIN_CONTAINER_ITEM} img`)
  );

  return items.some(duplicateImg);
};

const updateTitle = () => {
  const actionContainer = document.querySelector(`.${ACTION_CONTAINER}`);
  const title = document.querySelector(`.${HEADER} h3`);
  const items = document.querySelectorAll(`.${MAIN_CONTAINER_ITEM}`);
  title.innerText = `Selected Images (${items.length})`;

  actionContainer.style.display = items.length === 0 ? "none" : "grid";
};

const deleteItem = (element) => {
  const main = document.querySelector(`.${MAIN_CONTAINER}`);
  main.removeChild(element);
  updateTitle();
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
            padding: 5px 8px 8px 8px;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
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
         .${ACTION_CONTAINER} {
             width: 100%;
             display: grid;
             place-content: center;
         }
         .${ACTION_CONTAINER} button {
             padding: 5px 10px;
             border: none;
             outline: none;
             border-radius: 5px;
             margin-top: 10px;
             cursor: pointer !important;
             box-shadow: -6px -6px 8px rgba(255, 255, 255, 0.9), 5px 5px 8px rgba(0, 0, 0, 0.07);
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
