console.log("Content script running on page:", window.location.href);

// Test message to background
chrome.runtime.sendMessage({ type: "TEST", page: window.location.href }, (response) => {
  if(chrome.runtime.lastError){
    console.error("SendMessage error:", chrome.runtime.lastError.message);
  } else {
    console.log("Background response:", response);
  }
});
