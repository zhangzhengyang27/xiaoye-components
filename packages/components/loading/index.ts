import type { App, AppContext, Directive } from "vue";
import vLoading from "./src/directive";
import type { ElementLoading, LoadingBinding } from "./src/directive";
import type { LoadingInstance } from "./src/loading";
import { XyLoadingService } from "./src/service";
import type {
  LoadingGlobalConfig,
  LoadingOptions,
  LoadingOptionsResolved,
  LoadingParentElement
} from "./src/types";

export type {
  ElementLoading,
  LoadingBinding,
  LoadingGlobalConfig,
  LoadingInstance,
  LoadingOptions,
  LoadingOptionsResolved,
  LoadingParentElement
};

export const XyLoading = {
  install(app: App) {
    XyLoadingService._context = app._context;
    (
      vLoading as Directive<ElementLoading, LoadingBinding> & { _context: AppContext | null }
    )._context = app._context;
    app.directive("loading", vLoading as Directive<ElementLoading, LoadingBinding>);
    app.config.globalProperties.$loading = XyLoadingService;
  },
  directive: vLoading,
  service: XyLoadingService
};

export { vLoading, vLoading as XyLoadingDirective, XyLoadingService };

export default XyLoading;
