import Editor from "./src/editor.vue";
import type {
  EditorBlurHandler,
  EditorFocusHandler,
  EditorInstance,
  EditorInstanceHandler,
  EditorModelValueChangeHandler,
  EditorProps
} from "./src/editor";
import { withInstall } from "@xiaoye/utils";

export type {
  EditorBlurHandler,
  EditorFocusHandler,
  EditorInstance,
  EditorInstanceHandler,
  EditorModelValueChangeHandler,
  EditorProps
};

export const XyEditor = withInstall(Editor, "xy-editor");
export default XyEditor;
