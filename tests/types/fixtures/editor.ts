import type { EditorInstance, EditorProps } from "xiaoye-components";
import { XyEditor } from "xiaoye-components";

const props: EditorProps = {
  modelValue: "# 标题",
  placeholder: "请输入 Markdown",
  minHeight: 320,
  disabled: false
};

declare const instance: EditorInstance;

instance.getValue();
instance.setValue("## 更新内容");
instance.focus();

void props;
void XyEditor;
