import type { MarkdownRenderer } from "vitepress";

export function tableWrapperMdPlugin(md: MarkdownRenderer) {
  md.renderer.rules.table_open = () => '<div class="xy-vp-table"><table>';
  md.renderer.rules.table_close = () => "</table></div>";
}
