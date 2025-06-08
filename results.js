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
        li.textContent = `${item.username} - ${item.full_name}`;
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