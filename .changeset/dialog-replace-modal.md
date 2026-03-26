---
"xiaoye-components": minor
---

将 `Modal` 正式替换为高兼容的 `Dialog`。

- 移除 `xy-modal`、`Modal` 文档页和旧示例目录，统一切换到 `xy-dialog`
- 新增对齐 Element Plus `Dialog` 的能力，包括 `append-to-body`、`close-on-click-modal`、`close-on-press-escape`、`center`、`align-center`、`fullscreen`、`draggable`、`overflow`、分区 class、自定义 `transition` 和实例 `resetPosition`
- 抽出共享的 `useOverlayDialog` 供 `Dialog` 与 `Drawer` 复用，并补齐 `open-auto-focus` / `close-auto-focus` 焦点事件
- 这次变更包含明确的 breaking rename：原有 `xy-modal` 需要迁移到 `xy-dialog`
