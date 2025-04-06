document.addEventListener("DOMContentLoaded", () => {
    // Get the stored followers and followings from chrome storage
    chrome.storage.local.get(["followers", "followings", "dontFollowMeBack", "iDontFollowBack"], (data) => {
        const followers = JSON.parse(data.followers);
        const followings = JSON.parse(data.followings);
        const dontFollowMeBack = JSON.parse(data.dontFollowMeBack);
        const iDontFollowBack = JSON.parse(data.iDontFollowBack);
    
        if (dontFollowMeBack) {
            const dontFollowMeBackList = document.getElementById("dontFollowMeBack-list");
            dontFollowMeBack.forEach(following => {
            const listItem = document.createElement("li");
            listItem.textContent = `${following.username} - ${following.full_name}`;
            dontFollowMeBackList.appendChild(listItem);
            });
        }
    });
    chrome.storage.local.clear()
  });
  