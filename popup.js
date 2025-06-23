document.getElementById("username-form").addEventListener("submit", () => {
  document.getElementById("loadingSpinner").style.display = "block";
});

document.getElementById("howToLink").addEventListener("click", () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("howto.html"),
    type: "popup",
    width: 420,
    height: 500
  });
});

document.getElementById("closeBtn").addEventListener("click", () => {
    window.close();
});