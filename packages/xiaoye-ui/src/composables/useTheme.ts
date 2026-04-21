/**
 * 主题系统工具函数
 * 提供暗色模式切换和主题管理能力
 */

export type ThemeMode = "light" | "dark";

export interface ThemeOptions {
  /** 初始主题模式，默认跟随系统 */
  initialMode?: ThemeMode | "system";
  /** 是否持久化到 localStorage，默认 true */
  persist?: boolean;
  /** 存储键名 */
  storageKey?: string;
}

const DEFAULT_STORAGE_KEY = "xiaoye-ui-theme-mode";

function getStoredThemeMode(storageKey: string): ThemeMode | null {
  if (typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function getSystemThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme-mode", mode);
}

function removeThemeMode() {
  if (typeof document === "undefined") return;
  document.documentElement.removeAttribute("data-theme-mode");
}

/**
 * 设置主题模式
 */
export function setThemeMode(mode: ThemeMode, options: ThemeOptions = {}) {
  const { persist = true, storageKey = DEFAULT_STORAGE_KEY } = options;
  applyThemeMode(mode);
  if (persist && typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, mode);
  }
}

/**
 * 切换暗色模式
 */
export function toggleDark(options: ThemeOptions = {}) {
  const { storageKey = DEFAULT_STORAGE_KEY } = options;
  const current = getCurrentMode(options);
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  setThemeMode(next, options);
}

/**
 * 获取当前生效的主题模式
 */
export function getCurrentMode(options: ThemeOptions = {}): ThemeMode {
  const { initialMode = "system", storageKey = DEFAULT_STORAGE_KEY } = options;
  const stored = getStoredThemeMode(storageKey);
  if (stored) return stored;
  if (initialMode === "system") return getSystemThemeMode();
  return initialMode;
}

/**
 * 初始化主题（应在应用挂载时调用一次）
 */
export function initTheme(options: ThemeOptions = {}) {
  const { storageKey = DEFAULT_STORAGE_KEY } = options;
  const mode = getCurrentMode(options);
  applyThemeMode(mode);
  if (typeof window !== "undefined") {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      const stored = getStoredThemeMode(storageKey);
      if (!stored) {
        applyThemeMode(e.matches ? "dark" : "light");
      }
    });
  }
}

/**
 * 清除已保存的主题偏好
 */
export function clearStoredTheme(storageKey = DEFAULT_STORAGE_KEY) {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(storageKey);
  removeThemeMode();
}
