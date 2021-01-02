console.log("in content-script.js");

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(request.msg);

//   if (request.msg == "getFonts") {
//     // Initialize usage, incase the message is sent multiple times
//     fontUsage = {};

//     getFonts($("body"));

//     // send parse results back to popup
//     sendResponse({ fontUsage: fontUsage, fontSizeUsage: fontSizeUsage });
//   }
// });
