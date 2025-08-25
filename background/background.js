chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type === "TEST"){
    console.log("Message received from content script");
    sendResponse({ status: "ok" });
    // Important: true return for async if needed
    return true;
  }
});
