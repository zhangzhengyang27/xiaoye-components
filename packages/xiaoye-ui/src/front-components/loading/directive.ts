export interface LoadingOptions {
  text?: string;
  fullscreen?: boolean;
  body?: boolean;
  lock?: boolean;
  background?: string;
  spinner?: string;
}

export interface LoadingDirective {
  mounted(el: HTMLElement, binding: DirectiveBinding): void;
  updated(el: HTMLElement, binding: DirectiveBinding): void;
  unmounted(el: HTMLElement): void;
}

export type { LoadingOptions };

export const vLoading: LoadingDirective = {
  mounted(el: HTMLElement, binding: any) {
    if (!binding.value) return;
    const options = binding.arg || {};
    const overlay = document.createElement("div");
    overlay.className = "xyu-loading-mask";
    overlay.innerHTML = `
      <div class="xyu-loading-spinner">
        <div class="xyu-loading-ring">
          ${Array.from({ length: 12 }, () => "<div></div>").join("")}
        </div>
        ${options.text ? `<p class="xyu-loading-text">${options.text}</p>` : ""}
      </div>
    `;
    overlay.style.cssText = `
      position: ${options.fullscreen ? "fixed" : "absolute"};
      inset: 0;
      z-index: ${options.fullscreen ? "99999" : "10"};
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${options.background || "rgba(255,255,255,0.72)"};
    `;
    el.style.position = options.fullscreen || options.body ? "relative" : el.style.position || "relative";
    el.appendChild(overlay);
    (el as any).__loadingOverlay = overlay;
  },
  updated(el: HTMLElement, binding: any) {
    const overlay = (el as any).__loadingOverlay;
    if (!overlay) return;
    overlay.style.display = binding.value ? "flex" : "none";
  },
  unmounted(el: HTMLElement) {
    const overlay = (el as any).__loadingOverlay;
    if (overlay) {
      el.removeChild(overlay);
      delete (el as any).__loadingOverlay;
    }
  }
};
