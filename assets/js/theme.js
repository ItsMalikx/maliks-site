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

    // The icon comes from CSS (html[data-theme]); keep the accessible label in sync.
    const label = theme => button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    label(initial);

    button.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";

      // Switch every color at once (hover fades would otherwise lag behind the page).
      const root = document.documentElement;
      root.classList.add("theme-switching");
      applyTheme(next);
      saveTheme(next);
      label(next);
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    });
  }

  document.addEventListener("DOMContentLoaded", initThemeToggle);
})();