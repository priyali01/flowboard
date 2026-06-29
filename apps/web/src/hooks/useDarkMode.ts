// Light mode only — dark mode is disabled
export function useDarkMode() {
  // Force light mode always — remove any stored dark mode preference
  if (typeof window !== 'undefined') {
    window.document.documentElement.classList.remove('dark');
    localStorage.removeItem('flowboard-dark-mode');
  }

  return { isDarkMode: false, toggleDarkMode: () => {} };
}
