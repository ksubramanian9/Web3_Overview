// Handles light/dark theme switching and persistence
(function () {
  const STORAGE_KEY = 'theme';
  const body = document.body;

  function apply(theme) {
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }

  // Apply saved preference on load
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    apply(saved);
  }

  // Attach listener once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    });
  });
})();

