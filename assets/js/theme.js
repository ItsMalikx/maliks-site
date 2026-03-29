// Standalone theme script, adapted from your utility files for the main domain
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
    // Default to dark mode if no saved preference is found
    const saved = getSavedTheme();
    const initial = saved || "dark";
    applyTheme(initial);

    const button = document.getElementById("themeToggle");
    if (!button) return;

    // Set initial icon based on theme
    button.textContent = initial === "dark" ? "☾" : "☀︎";

    button.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";

      applyTheme(next);
      saveTheme(next);
      button.textContent = next === "dark" ? "☾" : "☀︎";
    });
  }

  // Initialize on load
  document.addEventListener("DOMContentLoaded", initThemeToggle);
})();