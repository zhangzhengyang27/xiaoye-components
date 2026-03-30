import Editor from "./src/editor.vue";
import type { EditorInstance, EditorProps } from "./src/editor";
import { withInstall } from "@xiaoye/utils";

export type { EditorInstance, EditorProps };

export const XyEditor = withInstall(Editor, "xy-editor");
export default XyEditor;
