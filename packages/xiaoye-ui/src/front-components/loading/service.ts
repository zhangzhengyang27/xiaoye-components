import type { LoadingOptions } from "./directive";

let loadingEl: HTMLElement | null = null;
let lockCount = 0;

function createOverlay(options: LoadingOptions) {
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
    position: ${options.fullscreen || options.body ? "fixed" : "absolute"};
    inset: 0;
    z-index: ${options.fullscreen ? "99999" : "10"};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${options.background || "rgba(255,255,255,0.72)"};
  `;
  return overlay;
}

const LoadingService = {
  show(options: LoadingOptions = {}): HTMLElement {
    const defaults: LoadingOptions = { fullscreen: false, body: false, lock: false, background: "rgba(255,255,255,0.72)" };
    const opts = { ...defaults, ...options };
    const overlay = createOverlay(opts);
    if (opts.fullscreen || opts.body) {
      const target = opts.body ? document.body : document.documentElement;
      target.style.position = "relative";
      target.appendChild(overlay);
      loadingEl = overlay;
    } else {
      const target = document.querySelector("[data-loading-target]") || document.body;
      target.style.position = "relative";
      target.appendChild(overlay);
    }
    if (opts.lock) lockCount++;
    return overlay;
  },

  hide() {
    if (loadingEl && loadingEl.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl);
      loadingEl = null;
    }
    if (lockCount > 0) lockCount--;
  }
};

export default LoadingService;
