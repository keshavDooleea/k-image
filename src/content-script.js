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
const KIMAGE_BODY = "k-image-body";

// message listener for background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === "onExtensionClicked") {
    toggleMainContainer();

    // check if main is already in dom
    const previewContainer = document.querySelector(`.${PREVIEW}`);
    if (document.body.contains(previewContainer)) {
      return;
    }

    addHeadResources();
    addCssStylesToHead();
    addMainPreview();
    addListeners();
  }

  sendResponse({ result: "success" });
});

const toggleMainContainer = () => {
  const previewContainer = document.querySelector(`.${PREVIEW}`);
  if (!previewContainer) {
    return;
  }

  previewContainer.style.display === "none"
    ? reAddMain(previewContainer)
    : removeMain(previewContainer);
};

const reAddMain = (previewContainer) => {
  previewContainer.style.display = "flex";
  addListeners();
};

const removeMain = (previewContainer) => {
  previewContainer.style.display = "none";
  document.body.classList.remove(KIMAGE_BODY);
};

const addMainPreview = () => {
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

  const clearButton = document.createElement("button");
  clearButton.innerText = "Clear";
  clearButton.addEventListener("click", clearImages);

  const downloadButton = document.createElement("button");
  downloadButton.innerText = "Download All";
  downloadButton.addEventListener("click", downloadImages);

  actionContainer.appendChild(clearButton);
  actionContainer.appendChild(downloadButton);

  container.appendChild(header);
  container.appendChild(mainContainer);
  container.appendChild(actionContainer);
  document.body.appendChild(container);
};

const addListeners = () => {
  const allImages = document.querySelectorAll("body img");
  const body = document.querySelector("body");

  body.classList.add(KIMAGE_BODY);

  // prevent click listeners on all dom elements except images
  body.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() !== "img") {
      return;
    }
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

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("img-container");
  const image = document.createElement("img");
  image.src = event.target.src;
  imageContainer.appendChild(image);

  const cross = document.createElement("div");
  cross.classList.add("cross");
  const crossIcon = document.createElement("i");
  crossIcon.classList.add("fas");
  crossIcon.classList.add("fa-times-circle");
  cross.addEventListener("click", (crossEvent) => {
    deleteItem(crossEvent.target.parentElement.parentElement);
  });
  cross.appendChild(crossIcon);

  const download = document.createElement("div");
  download.classList.add("download");
  const downloadIcon = document.createElement("i");
  downloadIcon.classList.add("fas");
  downloadIcon.classList.add("fa-arrow-alt-circle-down");
  download.addEventListener("click", () => downloadOneImage(image));
  download.appendChild(downloadIcon);

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("icon-container");
  iconContainer.appendChild(download);
  iconContainer.appendChild(cross);

  item.appendChild(imageContainer);
  item.appendChild(iconContainer);

  main.appendChild(item);
  updateTitle();
};

const clearImages = () => {
  const items = document.querySelectorAll(`.${MAIN_CONTAINER_ITEM}`);

  items.forEach((item) => {
    deleteItem(item);
  });
};

const downloadImages = (event) => {
  const images = document.querySelectorAll(`.${MAIN_CONTAINER_ITEM} img`);

  images.forEach((img) => {
    downloadOneImage(img);
  });
};

const downloadOneImage = (img) => {
  const anchorTag = document.createElement("a");
  anchorTag.href = img.src;
  anchorTag.download = `k-image-${img.src}`;
  anchorTag.click();
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

  actionContainer.style.display = items.length === 0 ? "none" : "flex";
};

const deleteItem = (element) => {
  const main = document.querySelector(`.${MAIN_CONTAINER}`);
  main.removeChild(element);
  updateTitle();
};

// css for preview container on top as well as dom elements
const addHeadResources = () => {
  // font awesome
  const fontAwesomeScript = document.createElement("script");
  fontAwesomeScript.type = "text/javascript";
  fontAwesomeScript.src = `https://kit.fontawesome.com/7d19f117b4.js`;
  fontAwesomeScript.crossOrigin = "anonymous";

  // custom font

  document.head.appendChild(fontAwesomeScript);
};

const addCssStylesToHead = () => {
  const mainBackground = "#232730cf";
  const itemsColor = "#ffffff0f";
  const textColor = "#b6bac2"; // grey
  const font = `font-family: 'Yanone Kaffeesatz', sans-serif;`;

  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
            @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@600&display=swap');

            .${KIMAGE_BODY}:not(img), .${KIMAGE_BODY} *:not(img) { cursor: not-allowed; }
            .${KIMAGE_BODY} img { cursor: pointer; }
            .${KIMAGE_BODY} img:hover { filter: brightness(125%); }

            .${PREVIEW} * {
                box-sizing: border-box; 
                cursor: initial !important;
            }
            .${PREVIEW} { 
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 90vh;
                background-color: ${mainBackground};
                backdrop-filter: blur(10px);
                z-index: 100000;
                display: flex;
                flex-direction: column;
                border-radius: 8px;
                padding: 5px 8px 8px 8px;
                overflow-y: auto;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                cursor: initial !important;
            }
            .${PREVIEW}::-webkit-scrollbar {
                width: 0;
            }
             .${HEADER} {
                 width: 100%;
                 height: 40px;
                 display: grid;
                 place-content: center;
                 letter-spacing: 0.5px;
                 color: ${textColor};
                 ${font}
             }
             .${MAIN_CONTAINER} {
                 width: 100%;
                 display: flex;
                 flex-direction: column;
             }
             .${ACTION_CONTAINER} {
                 width: 100%;
                 display: flex;
                 align-items: center;
                 justify-content: space-evenly;
                 margin-top: 10px;
             }
             .${ACTION_CONTAINER} button {
                 padding: 8px 10px;
                 border: none;
                 outline: none;
                 font-size: 15px;
                 border-radius: 5px;
                 letter-spacing: 0.5px;
                 cursor: pointer !important;
                 color: ${textColor};
                 background-color: ${mainBackground};
                 font-weight: bold;
                 ${font}
                }
             .${ACTION_CONTAINER} button:nth-child(1) {
             }
             .${MAIN_CONTAINER_ITEM} {
                 width: 100%;
                 height: 75px;
                 display: flex;
                 background-color: ${itemsColor};
                 border-radius: 5px;
                 padding: 5px 8px;
             }
             .${MAIN_CONTAINER_ITEM}:not(:nth-child(1)) {
                 margin-top: 10px;
             }
             .img-container {
                 width: 60%;
                 height: 100%;
                 display: flex;
                 align-items: center;
                 justify-content: center;
             }
             .img-container img {
                 max-width: 100%;
                 max-height: 100%;
                 justify-self: center;
                 cursor: initial !important;
             }
             .img-container img:hover {
                filter: brightness(100%);
             }
             .icon-container {
                 width: 40%;
                 height: 100%;
                 display: flex;
                 align-items: center;
                 justify-content: space-around;
             }
             .cross, .download {
                position: relative;
                display: grid;
                place-content: center;
                width: 35px;
                height: 35px;
                background-color: ${mainBackground};
                align-self: center;
                border-radius: 5px;
                cursor: pointer !important;
             }
             .cross i, .download i {
                font-size: 22px;
                cursor: pointer !important;
                pointer-events: none;
                color: ${textColor};
             }
        </style>`
  );
};
