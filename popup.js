document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("username-form").addEventListener("submit", () => {
    document.getElementById("loadingSpinner").style.display = "block";
  });

  document.getElementById("howToLink").addEventListener("click", () => {
    document.querySelector('.howToContainer').style.display = "block";
  }); 
  document.getElementById("closeBtn").addEventListener("click", () => {
    document.querySelector('.howToContainer').style.display = "none";
  });
})