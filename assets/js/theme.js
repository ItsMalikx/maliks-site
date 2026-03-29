(function() {
  function saveTheme(theme) {
    localStorage.setItem("main-site-theme", theme);
  }

  function getSavedTheme() {
    return localStorage.getItem("main-site-theme");
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function initThemeToggle() {
    const saved = getSavedTheme();
    const initial = saved || "dark";
    applyTheme(initial);

    const button = document.getElementById("themeToggle");
    if (!button) return;

    button.textContent = initial === "dark" ? "☾" : "☀︎";

    button.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";

      applyTheme(next);
      saveTheme(next);
      button.textContent = next === "dark" ? "☾" : "☀︎";
    });
  }

  document.addEventListener("DOMContentLoaded", initThemeToggle);
})();