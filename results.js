document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["followers", "followings", "dontFollowMeBack", "iDontFollowBack"], (data) => {
    const followers = JSON.parse(data.followers || "[]");
    const followings = JSON.parse(data.followings || "[]");
    const dontFollowMeBack = JSON.parse(data.dontFollowMeBack || "[]");
    const iDontFollowBack = JSON.parse(data.iDontFollowBack || "[]");

    const renderList = (listId, items) => {
  const ul = document.getElementById(listId);
    ul.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";

      const textSpan = document.createElement("span");
      textSpan.textContent = `${item.username} - ${item.full_name}`;

      const link = document.createElement("a");
      link.href = `https://www.instagram.com/${item.username}/`;
      link.target = "_blank";
      link.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30" style="margin-left: 8px;">
          <path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
        </svg>`;

      li.appendChild(textSpan);
      li.appendChild(link);
      ul.appendChild(li);
    });
  };

    renderList("followers-list", followers);
    renderList("followings-list", followings);
    renderList("dontFollowMeBack-list", dontFollowMeBack);
    renderList("iDontFollowBack-list", iDontFollowBack);
  });

  chrome.storage.local.clear();

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(tab => tab.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });

  // Dark mode toggle
  const darkToggle = document.getElementById("darkToggle");
  darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", darkToggle.checked);
  });

  document.getElementById("copyBtn").addEventListener("click", () => {
    const sections = [
      { id: "followers-list", label: "Followers" },
      { id: "followings-list", label: "Followings" },
      { id: "dontFollowMeBack-list", label: "Don't Follow Me Back" },
      { id: "iDontFollowBack-list", label: "I Don't Follow Back" }
    ];

    let text = "";

    sections.forEach(section => {
      const ul = document.getElementById(section.id);
      const items = Array.from(ul.querySelectorAll("li")).map(li => li.textContent);
      text += `${section.label}:\n${items.join("\n")}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      const notice = document.getElementById("copiedNotice");
      notice.style.display = "block";
      setTimeout(() => {
        notice.style.display = "none";
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  });

});