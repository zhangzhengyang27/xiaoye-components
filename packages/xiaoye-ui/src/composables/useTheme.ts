/**
 * 主题系统工具函数
 * 提供暗色模式切换和主题管理能力
 */

import { ref, onMounted } from "vue";

export type ThemeMode = "light" | "dark";
export type ThemePreset = "default" | "compact" | "elegant";

export interface ThemeOptions {
  /** 初始主题模式，默认跟随系统 */
  initialMode?: ThemeMode | "system";
  /** 是否持久化到 localStorage，默认 true */
  persist?: boolean;
  /** 存储键名 */
  storageKey?: string;
}

export interface PresetTokens {
  compact?: Partial<CSSCustomProperties>;
  elegant?: Partial<CSSCustomProperties>;
}

export interface ThemeOverride {
  component: string;
  tokens: Partial<CSSCustomProperties>;
}

const DEFAULT_STORAGE_KEY = "xiaoye-ui-theme-mode";

export const PRESET_THEMES: PresetTokens = {
  compact: {
    "--xyu-font-sans": "system-ui, -apple-system, sans-serif",
    "--xyu-text-sm": "12px",
    "--xyu-text-base": "13px",
    "--xyu-space-gap": "4px",
    "--xyu-space-gap-lg": "8px"
  },
  elegant: {
    "--xyu-font-sans": "Georgia, 'Times New Roman', serif",
    "--xyu-radius-lg": "12px",
    "--xyu-shadow-md": "0 6px 16px rgba(0,0,0,0.1)"
  }
};

const componentOverrides = new Map<string, Partial<CSSCustomProperties>>();

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
  return initialMode as ThemeMode;
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

/**
 * 应用预设主题
 */
export function applyPreset(preset: ThemePreset) {
  if (preset === "default") {
    Object.values(PRESET_THEMES).forEach((tokens) => {
      if (tokens) {
        Object.keys(tokens).forEach((key) => {
          document.documentElement.style.removeProperty(key);
        });
      }
    });
    return;
  }
  const tokens = PRESET_THEMES[preset];
  if (!tokens) return;
  Object.entries(tokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value as string);
  });
}

/**
 * 注册组件级主题覆盖
 */
export function overrideComponentTheme(component: string, tokens: Partial<CSSCustomProperties>) {
  const className = `xyu-${component}`;
  let styleEl = document.getElementById(`xyu-theme-override-${component}`) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = `xyu-theme-override-${component}`;
    document.head.appendChild(styleEl);
  }
  const cssVars = Object.entries(tokens)
    .map(([key, value]) => `.${className} { --${key.replace(/^--/, "")}: ${value}; }`)
    .join("\n");
  styleEl.textContent = cssVars;
  componentOverrides.set(component, tokens);
}

/**
 * 移除组件级主题覆盖
 */
export function removeComponentOverride(component: string) {
  const styleEl = document.getElementById(`xyu-theme-override-${component}`);
  if (styleEl) {
    styleEl.parentNode?.removeChild(styleEl);
  }
  componentOverrides.delete(component);
}

/**
 * 获取所有已注册的组件覆盖
 */
export function getComponentOverrides(): ThemeOverride[] {
  return Array.from(componentOverrides.entries()).map(([component, tokens]) => ({
    component,
    tokens
  }));
}

/**
 * useTheme Vue Composable
 */
export function useTheme(options: ThemeOptions = {}) {
  const isDark = ref(false);

  function apply() {
    isDark.value = getCurrentMode(options) === "dark";
    initTheme(options);
  }

  onMounted(apply);

  function toggle() {
    toggleDark(options);
    isDark.value = !isDark.value;
  }

  function setMode(mode: ThemeMode) {
    setThemeMode(mode, options);
    isDark.value = mode === "dark";
  }

  function applyThemePreset(preset: ThemePreset) {
    applyPreset(preset);
  }

  function override(component: string, tokens: Partial<CSSCustomProperties>) {
    overrideComponentTheme(component, tokens);
  }

  function removeOverride(component: string) {
    removeComponentOverride(component);
  }

  return {
    isDark,
    toggle,
    setMode,
    applyPreset: applyThemePreset,
    overrideComponentTheme: override,
    removeComponentOverride: removeOverride
  };
}
