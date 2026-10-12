import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/shared/store/themeStore'

/**
 * Runs before first paint, inlined into the document head.
 *
 * Without it the panel renders in light, then snaps to the stored theme once
 * React hydrates — a visible flash on every load for anyone not on the default.
 * It reads zustand-persist's envelope directly because no bundle has run yet.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = raw ? (JSON.parse(raw).state || {}).theme : null;
    document.documentElement.dataset.theme =
      theme === 'dark' || theme === 'dim' || theme === 'light' ? theme : '${DEFAULT_THEME}';
  } catch (error) {
    document.documentElement.dataset.theme = '${DEFAULT_THEME}';
  }
})();
`.trim()
