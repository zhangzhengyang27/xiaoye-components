// 由 scripts/generate-llm-files.mjs 自动生成，请勿手工编辑；事实源为 component-manifest 与文档，重新生成：pnpm generate:llm
export interface McpApiSchema {
  version: string;
  components: unknown[];
}

export const apiSchema: McpApiSchema = {
  "version": "1.0.0",
  "components": [
    {
      "name": "button",
      "title": "Button 按钮",
      "description": "页面主操作、次要操作和轻量文本动作入口。",
      "tags": [
        "xy-button",
        "xy-button-group"
      ],
      "exports": [
        "XyButton",
        "XyButtonGroup"
      ],
      "layer": "base",
      "props": [
        {
          "name": "type",
          "description": "按钮类型",
          "type": "('default' | 'primary' | 'success' | 'warning' | 'danger')",
          "default": "'default'"
        },
        {
          "name": "size",
          "description": "按钮尺寸",
          "type": "size",
          "default": "跟随全局配置"
        },
        {
          "name": "disabled",
          "description": "是否禁用交互",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "icon",
          "description": "前置 Iconify 图标",
          "type": "string",
          "default": "—"
        },
        {
          "name": "native-type",
          "description": "原生按钮类型",
          "type": "('button' | 'submit' | 'reset')",
          "default": "'button'"
        },
        {
          "name": "loading",
          "description": "是否显示加载态，并阻止点击",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-icon",
          "description": "自定义加载图标",
          "type": "string",
          "default": "'mdi:loading'"
        },
        {
          "name": "plain",
          "description": "是否为朴素按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "text",
          "description": "是否为文本按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "link",
          "description": "是否为链接按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "bg",
          "description": "文本按钮是否保留背景",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "autofocus",
          "description": "是否使用原生自动聚焦能力",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "round",
          "description": "是否为圆角按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "circle",
          "description": "是否为圆形按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "block",
          "description": "是否占满整行宽度",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "tag",
          "description": "渲染的根标签",
          "type": "string | Component",
          "default": "'button'"
        }
      ],
      "events": [
        {
          "name": "click",
          "description": "点击按钮时触发；当 loading 或 disabled 时不会触发",
          "params": "(event: MouseEvent) => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "按钮主内容",
          "props": ""
        },
        {
          "name": "icon",
          "description": "自定义前置图标，优先级低于 icon prop",
          "props": ""
        },
        {
          "name": "loading",
          "description": "自定义加载内容，优先级高于 loading-icon",
          "props": ""
        },
        {
          "name": "prefix",
          "description": "按钮前缀内容，当没有 icon / icon 插槽时生效",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "按钮后缀内容，通常用于补充图标或状态提示",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "ref",
          "description": "按钮根节点引用",
          "type": "ref"
        },
        {
          "name": "size",
          "description": "解析后的尺寸",
          "type": "size"
        },
        {
          "name": "type",
          "description": "解析后的按钮类型",
          "type": "type"
        },
        {
          "name": "disabled",
          "description": "解析后的禁用状态",
          "type": "disabled"
        }
      ]
    },
    {
      "name": "link",
      "title": "Link 文字链接",
      "description": "轻量跳转、说明区弱操作和文本级动作入口。",
      "tags": [
        "xy-link"
      ],
      "exports": [
        "XyLink"
      ],
      "layer": "base",
      "props": [
        {
          "name": "type",
          "description": "链接语义色",
          "type": "LinkType",
          "default": "'default'"
        },
        {
          "name": "underline",
          "description": "下划线显示策略",
          "type": "LinkUnderline",
          "default": "'hover'"
        },
        {
          "name": "disabled",
          "description": "是否禁用交互",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "href",
          "description": "原生链接地址",
          "type": "string",
          "default": "''"
        },
        {
          "name": "target",
          "description": "原生跳转目标",
          "type": "LinkTarget",
          "default": "'_self'"
        },
        {
          "name": "icon",
          "description": "前置 Iconify 图标",
          "type": "string",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "click",
          "description": "点击链接时触发；禁用时不会触发",
          "params": "LinkClickHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "链接主内容",
          "props": ""
        },
        {
          "name": "icon",
          "description": "自定义后置图标或附加图形",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "breadcrumb",
      "title": "Breadcrumb 面包屑",
      "description": "支持字符或图标分隔、链接跳转和当前页语义的面包屑组件。",
      "tags": [
        "xy-breadcrumb",
        "xy-breadcrumb-item"
      ],
      "exports": [
        "XyBreadcrumb",
        "XyBreadcrumbItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "separator",
          "description": "字符分隔符",
          "type": "string",
          "default": "'/'"
        },
        {
          "name": "separator-icon",
          "description": "图标分隔符",
          "type": "string",
          "default": "''"
        },
        {
          "name": "aria-label",
          "description": "导航区无障碍标签",
          "type": "string",
          "default": "'面包屑'"
        },
        {
          "name": "items",
          "description": "声明式面包屑项数组",
          "type": "BreadcrumbItemData[]",
          "default": "[]"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "面包屑项列表，通常传入 xy-breadcrumb-item",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "text",
      "title": "Text 文本",
      "description": "轻量文本语义、颜色强调与截断展示组件。",
      "tags": [
        "xy-text"
      ],
      "exports": [
        "XyText"
      ],
      "layer": "base",
      "props": [
        {
          "name": "type",
          "description": "文本语义色",
          "type": "TextType",
          "default": "'default'"
        },
        {
          "name": "size",
          "description": "文本尺寸",
          "type": "TextProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "truncated",
          "description": "是否启用单行省略",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "line-clamp",
          "description": "多行省略的最大行数",
          "type": "number | string",
          "default": "—"
        },
        {
          "name": "tag",
          "description": "渲染的根标签",
          "type": "string",
          "default": "'span'"
        },
        {
          "name": "copyable",
          "description": "是否显示复制按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "ellipsis-tooltip",
          "description": "溢出时是否补充 tooltip",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "expandable",
          "description": "是否支持展开收起",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "strong",
          "description": "是否加粗显示",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "underline",
          "description": "是否添加下划线",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "delete",
          "description": "是否添加删除线",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "文本内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "badge",
      "title": "Badge 徽章",
      "description": "数值、点状和自定义内容徽章组件。",
      "tags": [
        "xy-badge"
      ],
      "exports": [
        "XyBadge"
      ],
      "layer": "base",
      "props": [
        {
          "name": "value",
          "description": "显示值",
          "type": "string | number",
          "default": "''"
        },
        {
          "name": "max",
          "description": "最大值，超出时显示 {max}+",
          "type": "number",
          "default": "99"
        },
        {
          "name": "is-dot",
          "description": "是否显示为小圆点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "hidden",
          "description": "是否隐藏徽章",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "type",
          "description": "徽章类型",
          "type": "BadgeType",
          "default": "'danger'"
        },
        {
          "name": "show-zero",
          "description": "值为 0 时是否显示",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "color",
          "description": "自定义背景色",
          "type": "string",
          "default": "''"
        },
        {
          "name": "badge-style",
          "description": "自定义徽章样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "—"
        },
        {
          "name": "offset",
          "description": "徽章偏移量 [x, y]",
          "type": "[number, number]",
          "default": "[0, 0]"
        },
        {
          "name": "badge-class",
          "description": "自定义徽章类名",
          "type": "string",
          "default": "''"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "宿主内容",
          "props": ""
        },
        {
          "name": "content",
          "description": "自定义徽章内容，接收 BadgeContentSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "content",
          "description": "计算后的徽章值",
          "type": "BadgeInstance[\"content\"]"
        }
      ]
    },
    {
      "name": "avatar",
      "title": "Avatar 头像",
      "description": "图片、图标或文字头像展示组件。",
      "tags": [
        "xy-avatar",
        "xy-avatar-group"
      ],
      "exports": [
        "XyAvatar",
        "XyAvatarGroup"
      ],
      "layer": "base",
      "props": [
        {
          "name": "size",
          "description": "头像尺寸",
          "type": "AvatarProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "shape",
          "description": "头像形状",
          "type": "AvatarShape",
          "default": "'circle'"
        },
        {
          "name": "icon",
          "description": "图片失败或无图片时的图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "src",
          "description": "图片地址",
          "type": "string",
          "default": "''"
        },
        {
          "name": "alt",
          "description": "原生图片 alt",
          "type": "string",
          "default": "''"
        },
        {
          "name": "src-set",
          "description": "原生图片 srcset",
          "type": "string",
          "default": "''"
        },
        {
          "name": "fit",
          "description": "图片裁切方式",
          "type": "AvatarFit",
          "default": "'cover'"
        }
      ],
      "events": [
        {
          "name": "error",
          "description": "图片加载失败时触发",
          "params": "AvatarErrorHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "当无图片且无 icon 时展示",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "image",
      "title": "Image 图片",
      "description": "用于承载图片展示、懒加载和大图预览。",
      "tags": [
        "xy-image"
      ],
      "exports": [
        "XyImage"
      ],
      "layer": "base",
      "props": [
        {
          "name": "src",
          "description": "图片地址",
          "type": "string",
          "default": "''"
        },
        {
          "name": "alt",
          "description": "原生图片 alt 文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "fit",
          "description": "图片裁切方式",
          "type": "ImageFit",
          "default": "'cover'"
        },
        {
          "name": "loading",
          "description": "原生图片加载策略",
          "type": "ImageLoading",
          "default": "undefined"
        },
        {
          "name": "lazy",
          "description": "是否启用基于 IntersectionObserver 的懒加载",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "scroll-container",
          "description": "懒加载监听容器，支持选择器或 HTMLElement",
          "type": "string | HTMLElement",
          "default": "undefined"
        },
        {
          "name": "preview-src-list",
          "description": "预览图片列表",
          "type": "string[]",
          "default": "[]"
        },
        {
          "name": "preview-teleported",
          "description": "预览层是否 Teleport 到 body",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "z-index",
          "description": "预览层层级",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "initial-index",
          "description": "预览初始索引",
          "type": "number",
          "default": "0"
        },
        {
          "name": "infinite",
          "description": "预览翻页是否循环",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "hide-on-click-modal",
          "description": "点击遮罩是否关闭预览",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "close-on-press-escape",
          "description": "按下 Escape 是否关闭预览",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "zoom-rate",
          "description": "预览层每次缩放的倍率",
          "type": "number",
          "default": "1.2"
        },
        {
          "name": "scale",
          "description": "预览层初始缩放比例",
          "type": "number",
          "default": "1"
        },
        {
          "name": "min-scale",
          "description": "预览层最小缩放比例",
          "type": "number",
          "default": "0.2"
        },
        {
          "name": "max-scale",
          "description": "预览层最大缩放比例",
          "type": "number",
          "default": "7"
        },
        {
          "name": "show-progress",
          "description": "是否显示预览进度",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "crossorigin",
          "description": "原生图片 crossorigin 属性",
          "type": "ImageCrossorigin",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "load",
          "description": "图片加载成功时触发",
          "params": "ImageLoadHandler"
        },
        {
          "name": "error",
          "description": "图片加载失败时触发",
          "params": "ImageErrorHandler"
        },
        {
          "name": "show",
          "description": "打开预览层时触发",
          "params": "—"
        },
        {
          "name": "close",
          "description": "关闭预览层时触发",
          "params": "—"
        },
        {
          "name": "switch",
          "description": "预览图片切换时触发",
          "params": "ImageSwitchHandler"
        }
      ],
      "slots": [
        {
          "name": "placeholder",
          "description": "自定义加载占位内容",
          "props": ""
        },
        {
          "name": "error",
          "description": "自定义加载失败内容",
          "props": ""
        },
        {
          "name": "progress",
          "description": "自定义预览进度内容，接收 ImageViewerProgressSlotProps",
          "props": ""
        },
        {
          "name": "toolbar",
          "description": "自定义预览工具栏，接收 ImageViewerToolbarSlotProps",
          "props": ""
        },
        {
          "name": "viewer-error",
          "description": "自定义预览大图失败内容，接收 ImageViewerErrorSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "showPreview",
          "description": "手动打开预览层",
          "type": "ImageInstance[\"showPreview\"]"
        },
        {
          "name": "closePreview",
          "description": "手动关闭预览层",
          "type": "ImageInstance[\"closePreview\"]"
        }
      ]
    },
    {
      "name": "watermark",
      "title": "Watermark 水印",
      "description": "用于为容器叠加重复文字或图片水印。",
      "tags": [
        "xy-watermark"
      ],
      "exports": [
        "XyWatermark"
      ],
      "layer": "base",
      "props": [
        {
          "name": "width",
          "description": "水印宽度",
          "type": "number",
          "default": "文本模式按内容测量，图片模式为 120"
        },
        {
          "name": "height",
          "description": "水印高度",
          "type": "number",
          "default": "文本模式按内容测量，图片模式为 64"
        },
        {
          "name": "rotate",
          "description": "绘制时的旋转角度，单位为 °",
          "type": "number",
          "default": "-22"
        },
        {
          "name": "z-index",
          "description": "水印层层级",
          "type": "number",
          "default": "9"
        },
        {
          "name": "image",
          "description": "图片水印地址，优先级高于 content",
          "type": "string",
          "default": "—"
        },
        {
          "name": "content",
          "description": "文字水印内容，支持单行或多行",
          "type": "string | string[]",
          "default": "'Xiaoye Components'"
        },
        {
          "name": "font",
          "description": "文字样式配置",
          "type": "WatermarkFont",
          "default": "见下表"
        },
        {
          "name": "gap",
          "description": "水印之间的水平和垂直间距",
          "type": "[number, number]",
          "default": "[100, 100]"
        },
        {
          "name": "offset",
          "description": "水印距离容器左上角的偏移量，默认取 gap / 2",
          "type": "[number, number]",
          "default": "[gap[0] / 2, gap[1] / 2]"
        },
        {
          "name": "disabled",
          "description": "是否禁用水印渲染",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "opacity",
          "description": "水印层透明度，内部会限制在 0 ~ 1",
          "type": "number",
          "default": "1"
        },
        {
          "name": "repeat",
          "description": "背景重复策略",
          "type": "WatermarkRepeat",
          "default": "'repeat'"
        },
        {
          "name": "auto-observe",
          "description": "是否启用 DOM 观察器做自恢复",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "fullscreen",
          "description": "是否把水印直接挂到 document.body 上",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "target",
          "description": "指定外部宿主容器，支持选择器或 HTMLElement",
          "type": "WatermarkProps[\"target\"]",
          "default": "undefined"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "需要叠加水印的内容容器",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "card",
      "title": "Card 卡片",
      "description": "头部、主体、底部三段式内容容器。",
      "tags": [
        "xy-card"
      ],
      "exports": [
        "XyCard"
      ],
      "layer": "base",
      "props": [
        {
          "name": "size",
          "description": "卡片密度",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "variant",
          "description": "卡片表面风格",
          "type": "CardVariant",
          "default": "'default'"
        },
        {
          "name": "bordered",
          "description": "是否显示外边框",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "header",
          "description": "头部内容",
          "type": "string",
          "default": "''"
        },
        {
          "name": "footer",
          "description": "底部内容",
          "type": "string",
          "default": "''"
        },
        {
          "name": "extra",
          "description": "头部右侧补充内容",
          "type": "string",
          "default": "''"
        },
        {
          "name": "body-style",
          "description": "主体样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        },
        {
          "name": "header-class",
          "description": "头部自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "body-class",
          "description": "主体自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "footer-class",
          "description": "底部自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "header-divider",
          "description": "是否显示头部分隔线",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "footer-divider",
          "description": "是否显示底部分隔线",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "shadow",
          "description": "阴影显示方式",
          "type": "CardShadow",
          "default": "'always'"
        },
        {
          "name": "loading",
          "description": "是否显示加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-text",
          "description": "默认加载态文案",
          "type": "string",
          "default": "'加载中'"
        },
        {
          "name": "empty",
          "description": "是否显示空态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "empty-title",
          "description": "默认空态标题",
          "type": "string",
          "default": "'暂无数据'"
        },
        {
          "name": "empty-description",
          "description": "默认空态描述",
          "type": "string",
          "default": "''"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "卡片主体",
          "props": ""
        },
        {
          "name": "header",
          "description": "完全自定义卡片头部，优先级高于 header/extra",
          "props": ""
        },
        {
          "name": "extra",
          "description": "标准头部右侧操作区",
          "props": ""
        },
        {
          "name": "footer",
          "description": "卡片底部",
          "props": ""
        },
        {
          "name": "loading",
          "description": "自定义加载态内容",
          "props": ""
        },
        {
          "name": "empty",
          "description": "自定义空态内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "check-card",
      "title": "Check Card 选择卡片",
      "description": "用卡片式信息块承接单选、多选和方案切换。",
      "tags": [
        "xy-check-card",
        "xy-check-card-group"
      ],
      "exports": [
        "XyCheckCard",
        "XyCheckCardGroup"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "是否选中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "卡片尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "title",
          "description": "标题文本",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "描述文本",
          "type": "string",
          "default": "''"
        },
        {
          "name": "extra",
          "description": "右上角轻操作文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "avatar",
          "description": "头像配置",
          "type": "CheckCardAvatar",
          "default": "—"
        },
        {
          "name": "tag",
          "description": "标题旁标签",
          "type": "string | CheckCardTag",
          "default": "—"
        },
        {
          "name": "aria-label",
          "description": "无障碍标签",
          "type": "string",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中状态变化时触发",
          "params": "(checked: boolean) => void"
        },
        {
          "name": "change",
          "description": "选中状态变化时触发",
          "params": "(checked: boolean) => void"
        },
        {
          "name": "extra",
          "description": "点击右上角操作区时触发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "avatar",
          "description": "自定义头像区",
          "props": ""
        },
        {
          "name": "title",
          "description": "自定义标题区",
          "props": ""
        },
        {
          "name": "tag",
          "description": "自定义标签区",
          "props": ""
        },
        {
          "name": "description",
          "description": "自定义描述区",
          "props": ""
        },
        {
          "name": "extra",
          "description": "自定义右上角轻操作区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "carousel",
      "title": "Carousel 走马灯",
      "description": "自动播放、指示器和卡片模式的内容轮播组件。",
      "tags": [
        "xy-carousel",
        "xy-carousel-item"
      ],
      "exports": [
        "XyCarousel",
        "XyCarouselItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "initial-index",
          "description": "初始激活项索引",
          "type": "number",
          "default": "0"
        },
        {
          "name": "active-index",
          "description": "当前激活项索引（受控）",
          "type": "number",
          "default": "—"
        },
        {
          "name": "height",
          "description": "走马灯高度",
          "type": "string",
          "default": "''"
        },
        {
          "name": "trigger",
          "description": "指示器触发方式",
          "type": "CarouselTrigger",
          "default": "'hover'"
        },
        {
          "name": "autoplay",
          "description": "是否自动播放",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "interval",
          "description": "自动播放间隔",
          "type": "number",
          "default": "3000"
        },
        {
          "name": "indicator-position",
          "description": "指示器位置",
          "type": "CarouselIndicatorPosition",
          "default": "''"
        },
        {
          "name": "arrow",
          "description": "箭头显示时机",
          "type": "CarouselArrow",
          "default": "'hover'"
        },
        {
          "name": "type",
          "description": "走马灯类型",
          "type": "CarouselType",
          "default": "''"
        },
        {
          "name": "card-scale",
          "description": "卡片模式缩放比例",
          "type": "number",
          "default": "0.83"
        },
        {
          "name": "loop",
          "description": "是否循环显示",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "direction",
          "description": "展示方向",
          "type": "CarouselDirection",
          "default": "'horizontal'"
        },
        {
          "name": "pause-on-hover",
          "description": "鼠标移入时是否暂停",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "draggable",
          "description": "是否支持拖拽切换",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "effect",
          "description": "动画效果",
          "type": "CarouselEffect",
          "default": "'slide'"
        },
        {
          "name": "duration",
          "description": "动画时长",
          "type": "number",
          "default": "400"
        },
        {
          "name": "easing",
          "description": "动画缓动函数",
          "type": "string",
          "default": "cubic-bezier(0.22, 0.61, 0.36, 1)"
        },
        {
          "name": "slides-per-view",
          "description": "可视 slide 数量",
          "type": "number",
          "default": "1"
        },
        {
          "name": "slides-per-group",
          "description": "每次翻页数量",
          "type": "number",
          "default": "1"
        },
        {
          "name": "gap",
          "description": "slide 间距",
          "type": "number | string",
          "default": "0"
        },
        {
          "name": "centered",
          "description": "是否居中当前页",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "indicator-type",
          "description": "指示器样式",
          "type": "CarouselIndicatorType",
          "default": "line"
        },
        {
          "name": "thumbs",
          "description": "是否显示缩略图条",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "thumbs-placement",
          "description": "缩略图条位置",
          "type": "CarouselThumbPlacement",
          "default": "'bottom'"
        },
        {
          "name": "thumbs-per-view",
          "description": "缩略图条每屏可见数量",
          "type": "number",
          "default": "5"
        },
        {
          "name": "thumbs-gap",
          "description": "缩略图间距",
          "type": "number | string",
          "default": "8"
        },
        {
          "name": "thumbs-indicator-type",
          "description": "缩略图样式",
          "type": "CarouselThumbIndicatorType",
          "default": "'thumbnail'"
        },
        {
          "name": "show-progress",
          "description": "是否显示自动播放进度",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "progress-placement",
          "description": "进度条位置",
          "type": "CarouselProgressPlacement",
          "default": "'bottom'"
        },
        {
          "name": "progress-color",
          "description": "进度条颜色",
          "type": "string",
          "default": "''"
        },
        {
          "name": "align",
          "description": "内容流对齐方式",
          "type": "CarouselAlignment",
          "default": "'start'"
        },
        {
          "name": "contain-scroll",
          "description": "内容流边界策略",
          "type": "CarouselContainScroll",
          "default": "'trim'"
        },
        {
          "name": "peek",
          "description": "露出边缘尺寸",
          "type": "number | string",
          "default": "0"
        },
        {
          "name": "lazy",
          "description": "是否启用邻近懒渲染",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "lazy-range",
          "description": "邻近懒渲染范围",
          "type": "number",
          "default": "1"
        },
        {
          "name": "virtual",
          "description": "是否启用窗口化渲染",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "virtual-buffer",
          "description": "窗口化缓冲范围",
          "type": "number",
          "default": "1"
        },
        {
          "name": "aria-label",
          "description": "无障碍标签",
          "type": "string",
          "default": "''"
        },
        {
          "name": "keyboard",
          "description": "是否启用键盘切换",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "update:activeIndex",
          "description": "受控模式下当前页变更",
          "params": "CarouselActiveIndexChangeHandler"
        },
        {
          "name": "change",
          "description": "当前激活项切换时触发",
          "params": "CarouselChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "轮播项列表，通常传入 xy-carousel-item",
          "props": ""
        },
        {
          "name": "indicator",
          "description": "自定义指示器，接收 CarouselIndicatorSlotProps",
          "props": ""
        },
        {
          "name": "arrow-prev",
          "description": "自定义上一页箭头，接收 CarouselArrowSlotProps",
          "props": ""
        },
        {
          "name": "arrow-next",
          "description": "自定义下一页箭头，接收 CarouselArrowSlotProps",
          "props": ""
        },
        {
          "name": "progress",
          "description": "自定义进度条，接收 CarouselProgressSlotProps",
          "props": ""
        },
        {
          "name": "thumb",
          "description": "自定义缩略图项，接收 CarouselThumbSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "activeIndex",
          "description": "当前激活项索引",
          "type": "CarouselInstance[\"activeIndex\"]"
        },
        {
          "name": "setActiveItem",
          "description": "手动切换到指定项",
          "type": "CarouselInstance[\"setActiveItem\"]"
        },
        {
          "name": "prev",
          "description": "切换到上一项",
          "type": "CarouselInstance[\"prev\"]"
        },
        {
          "name": "next",
          "description": "切换到下一项",
          "type": "CarouselInstance[\"next\"]"
        }
      ]
    },
    {
      "name": "affix",
      "title": "Affix 固钉",
      "description": "将内容固定在视口顶部或底部，并可限制在指定容器范围内。",
      "tags": [
        "xy-affix"
      ],
      "exports": [
        "XyAffix"
      ],
      "layer": "base",
      "props": [
        {
          "name": "offset",
          "description": "与顶部或底部的偏移距离，单位 px",
          "type": "number",
          "default": "0"
        },
        {
          "name": "position",
          "description": "固定位置",
          "type": "AffixPosition",
          "default": "'top'"
        },
        {
          "name": "target",
          "description": "目标容器选择器",
          "type": "string",
          "default": "''"
        },
        {
          "name": "z-index",
          "description": "固定节点层级",
          "type": "AffixZIndex",
          "default": "100"
        },
        {
          "name": "teleported",
          "description": "固定态时是否通过 Teleport 挂载到外部容器",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "append-to",
          "description": "Teleport 的挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        }
      ],
      "events": [
        {
          "name": "change",
          "description": "固定状态变化时触发",
          "params": "AffixChangeHandler"
        },
        {
          "name": "scroll",
          "description": "监听到滚动后触发",
          "params": "AffixScrollHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "固钉内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "update",
          "description": "立即重新计算固钉状态",
          "type": "AffixInstance[\"update\"]"
        },
        {
          "name": "updateRoot",
          "description": "重新测量占位尺寸并刷新固钉状态",
          "type": "AffixInstance[\"updateRoot\"]"
        }
      ]
    },
    {
      "name": "anchor",
      "title": "Anchor 锚点",
      "description": "通过页内锚点快速定位长内容章节，支持滚动高亮、marker、局部滚动容器和 hash 同步。",
      "tags": [
        "xy-anchor",
        "xy-anchor-link"
      ],
      "exports": [
        "XyAnchor",
        "XyAnchorLink"
      ],
      "layer": "base",
      "props": [
        {
          "name": "container",
          "description": "滚动容器，可传选择器、HTMLElement、window 或 null",
          "type": "AnchorContainer",
          "default": "null"
        },
        {
          "name": "offset",
          "description": "锚点滚动后的额外偏移距离",
          "type": "number",
          "default": "0"
        },
        {
          "name": "bound",
          "description": "提前触发 active 切换的边界偏移",
          "type": "number",
          "default": "15"
        },
        {
          "name": "duration",
          "description": "平滑滚动时长，单位毫秒",
          "type": "number",
          "default": "300"
        },
        {
          "name": "marker",
          "description": "是否显示 marker 指示条",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "direction",
          "description": "导航方向",
          "type": "AnchorDirection",
          "default": "'vertical'"
        },
        {
          "name": "sync-hash",
          "description": "是否在挂载、点击和滚动时同步 URL hash",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "change",
          "description": "当前高亮锚点变化时触发",
          "params": "AnchorChangeHandler"
        },
        {
          "name": "click",
          "description": "点击锚点时触发",
          "params": "AnchorClickHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "xy-anchor-link 组件列表",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "scrollTo",
          "description": "手动滚动到指定锚点",
          "type": "AnchorInstance[\"scrollTo\"]"
        }
      ]
    },
    {
      "name": "menu",
      "title": "Menu 菜单",
      "description": "支持横向、纵向、折叠、受控状态和 items 数据驱动的声明式导航菜单。",
      "tags": [
        "xy-menu",
        "xy-menu-item",
        "xy-menu-item-group",
        "xy-sub-menu"
      ],
      "exports": [
        "XyMenu",
        "XyMenuItem",
        "XyMenuItemGroup",
        "XySubMenu"
      ],
      "layer": "base",
      "props": [
        {
          "name": "mode",
          "description": "菜单展示模式",
          "type": "MenuMode",
          "default": "'vertical'"
        },
        {
          "name": "default-active",
          "description": "初始激活项 index",
          "type": "string",
          "default": "''"
        },
        {
          "name": "default-openeds",
          "description": "初始展开的子菜单索引集合",
          "type": "string[]",
          "default": "[]"
        },
        {
          "name": "active-index",
          "description": "受控激活项 index",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "opened-menus",
          "description": "受控展开的子菜单索引集合",
          "type": "string[]",
          "default": "undefined"
        },
        {
          "name": "unique-opened",
          "description": "是否同一层只允许展开一个子菜单",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "router",
          "description": "是否启用路由模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "menu-trigger",
          "description": "横向模式下子菜单触发方式",
          "type": "MenuTrigger",
          "default": "'hover'"
        },
        {
          "name": "collapse",
          "description": "是否折叠，仅纵向模式生效",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "items",
          "description": "数据驱动菜单树，和默认插槽二选一",
          "type": "MenuDataItem[]",
          "default": "undefined"
        },
        {
          "name": "permission-checker",
          "description": "items 模式下的权限判定函数",
          "type": "MenuPermissionChecker",
          "default": "undefined"
        },
        {
          "name": "ellipsis",
          "description": "横向模式宽度不足时是否启用收纳",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "popper-offset",
          "description": "所有弹出子菜单的偏移量",
          "type": "number",
          "default": "6"
        },
        {
          "name": "ellipsis-icon",
          "description": "横向收纳入口图标",
          "type": "string | Component",
          "default": "'mdi:dots-horizontal'"
        },
        {
          "name": "popper-effect",
          "description": "弹出菜单主题",
          "type": "MenuPopperEffect",
          "default": "'dark'"
        },
        {
          "name": "popper-class",
          "description": "弹出菜单自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "弹出菜单自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        },
        {
          "name": "show-timeout",
          "description": "弹出菜单显示延迟",
          "type": "number",
          "default": "300"
        },
        {
          "name": "hide-timeout",
          "description": "弹出菜单隐藏延迟",
          "type": "number",
          "default": "300"
        },
        {
          "name": "close-on-click-outside",
          "description": "点击外部时是否关闭已展开菜单",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "collapse-transition",
          "description": "是否启用纵向折叠过渡",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "persistent",
          "description": "关闭后是否保留弹出菜单 DOM",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "background-color",
          "description": "菜单背景色兼容属性",
          "type": "string",
          "default": "''"
        },
        {
          "name": "text-color",
          "description": "菜单文字色兼容属性",
          "type": "string",
          "default": "''"
        },
        {
          "name": "active-text-color",
          "description": "激活项文字色兼容属性",
          "type": "string",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "select",
          "description": "菜单项被选中时触发",
          "params": "MenuSelectEvent"
        },
        {
          "name": "open",
          "description": "子菜单展开时触发",
          "params": "MenuOpenEvent"
        },
        {
          "name": "close",
          "description": "子菜单收起时触发",
          "params": "MenuCloseEvent"
        },
        {
          "name": "update:activeIndex",
          "description": "受控模式下激活项变化时触发",
          "params": "MenuActiveIndexChangeHandler"
        },
        {
          "name": "update:openedMenus",
          "description": "受控模式下展开项集合变化时触发",
          "params": "MenuOpenedMenusChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "放置 xy-menu-item、xy-sub-menu、xy-menu-item-group；若同时传 items，默认插槽优先",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "open",
          "description": "主动展开指定子菜单",
          "type": "MenuExposes[\"open\"]"
        },
        {
          "name": "close",
          "description": "主动收起指定子菜单",
          "type": "MenuExposes[\"close\"]"
        },
        {
          "name": "handleResize",
          "description": "手动重新计算横向溢出状态",
          "type": "MenuExposes[\"handleResize\"]"
        },
        {
          "name": "updateActiveIndex",
          "description": "主动更新当前激活项",
          "type": "MenuExposes[\"updateActiveIndex\"]"
        }
      ]
    },
    {
      "name": "row",
      "title": "Row 栅格行",
      "description": "24 栅格布局容器与列组件。",
      "tags": [
        "xy-row"
      ],
      "exports": [
        "XyRow"
      ],
      "layer": "base",
      "props": [
        {
          "name": "tag",
          "description": "渲染的根标签",
          "type": "string",
          "default": "'div'"
        },
        {
          "name": "gutter",
          "description": "栅格间距，单位为 px",
          "type": "number",
          "default": "0"
        },
        {
          "name": "justify",
          "description": "主轴对齐方式",
          "type": "RowJustify",
          "default": "'start'"
        },
        {
          "name": "align",
          "description": "交叉轴对齐方式",
          "type": "RowAlign",
          "default": "—"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "行内容，一般由多个 xy-col 组成",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "col",
      "title": "Col 栅格列",
      "description": "配合 Row 使用的 24 栅格列组件。",
      "tags": [
        "xy-col"
      ],
      "exports": [
        "XyCol"
      ],
      "layer": "base",
      "props": [
        {
          "name": "tag",
          "description": "渲染的根标签",
          "type": "string",
          "default": "'div'"
        },
        {
          "name": "span",
          "description": "当前列占据的栅格数",
          "type": "number",
          "default": "24"
        },
        {
          "name": "offset",
          "description": "左侧偏移的栅格数",
          "type": "number",
          "default": "0"
        },
        {
          "name": "pull",
          "description": "向左位移的栅格数",
          "type": "number",
          "default": "0"
        },
        {
          "name": "push",
          "description": "向右位移的栅格数",
          "type": "number",
          "default": "0"
        },
        {
          "name": "xs",
          "description": "< 768px 的响应式列配置",
          "type": "ColSize",
          "default": "—"
        },
        {
          "name": "sm",
          "description": ">= 768px 的响应式列配置",
          "type": "ColSize",
          "default": "—"
        },
        {
          "name": "md",
          "description": ">= 992px 的响应式列配置",
          "type": "ColSize",
          "default": "—"
        },
        {
          "name": "lg",
          "description": ">= 1200px 的响应式列配置",
          "type": "ColSize",
          "default": "—"
        },
        {
          "name": "xl",
          "description": ">= 1920px 的响应式列配置",
          "type": "ColSize",
          "default": "—"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "列内容，通常承载卡片、表单块或工具区域",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "scrollbar",
      "title": "Scrollbar 滚动条",
      "description": "自定义滚动容器、滚动条样式与滚动控制组件。",
      "tags": [
        "xy-scrollbar"
      ],
      "exports": [
        "XyScrollbar"
      ],
      "layer": "base",
      "props": [
        {
          "name": "distance",
          "description": "触发 endReached 的距离阈值，单位 px",
          "type": "number",
          "default": "0"
        },
        {
          "name": "height",
          "description": "固定高度",
          "type": "number | string",
          "default": "''"
        },
        {
          "name": "max-height",
          "description": "最大高度",
          "type": "number | string",
          "default": "''"
        },
        {
          "name": "native",
          "description": "是否使用原生滚动条",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "wrap-style",
          "description": "滚动容器样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        },
        {
          "name": "wrap-class",
          "description": "滚动容器类名",
          "type": "string | string[]",
          "default": "''"
        },
        {
          "name": "view-style",
          "description": "视图容器样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        },
        {
          "name": "view-class",
          "description": "视图容器类名",
          "type": "string | string[]",
          "default": "''"
        },
        {
          "name": "noresize",
          "description": "是否跳过尺寸监听",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "tag",
          "description": "视图容器标签",
          "type": "string",
          "default": "'div'"
        },
        {
          "name": "always",
          "description": "是否始终显示自定义滚动条",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "min-size",
          "description": "滚动条 thumb 最小尺寸",
          "type": "number",
          "default": "20"
        },
        {
          "name": "tabindex",
          "description": "滚动容器 tabindex",
          "type": "number | string",
          "default": "—"
        },
        {
          "name": "id",
          "description": "视图容器 id",
          "type": "string",
          "default": "—"
        },
        {
          "name": "role",
          "description": "视图容器 role",
          "type": "string",
          "default": "—"
        },
        {
          "name": "aria-label",
          "description": "视图容器 aria-label",
          "type": "string",
          "default": "—"
        },
        {
          "name": "aria-orientation",
          "description": "视图容器 aria-orientation",
          "type": "ScrollbarProps[\"ariaOrientation\"]",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "scroll",
          "description": "滚动时触发",
          "params": "ScrollbarScrollPayload"
        },
        {
          "name": "endReached",
          "description": "滚动接近边界时触发",
          "params": "ScrollbarDirection"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "滚动内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "wrapRef",
          "description": "滚动容器引用",
          "type": "ScrollbarInstance[\"wrapRef\"]"
        },
        {
          "name": "update",
          "description": "手动更新滚动条状态",
          "type": "ScrollbarInstance[\"update\"]"
        },
        {
          "name": "scrollTo",
          "description": "滚动到指定位置",
          "type": "ScrollbarInstance[\"scrollTo\"]"
        },
        {
          "name": "setScrollTop",
          "description": "设置纵向滚动位置",
          "type": "ScrollbarInstance[\"setScrollTop\"]"
        },
        {
          "name": "setScrollLeft",
          "description": "设置横向滚动位置",
          "type": "ScrollbarInstance[\"setScrollLeft\"]"
        },
        {
          "name": "handleScroll",
          "description": "手动触发滚动同步",
          "type": "ScrollbarInstance[\"handleScroll\"]"
        }
      ]
    },
    {
      "name": "splitter",
      "title": "Splitter 分隔面板",
      "description": "用拖拽分隔条组织双栏或上下布局的基础分区组件。",
      "tags": [
        "xy-splitter",
        "xy-splitter-panel"
      ],
      "exports": [
        "XySplitter",
        "XySplitterPanel"
      ],
      "layer": "base",
      "props": [
        {
          "name": "layout",
          "description": "面板排列方向",
          "type": "SplitterLayout",
          "default": "'horizontal'"
        },
        {
          "name": "lazy",
          "description": "是否在拖拽结束后再提交最终尺寸",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "resize-start",
          "description": "开始拖拽时触发",
          "params": "SplitterResizeHandler"
        },
        {
          "name": "resize",
          "description": "拖拽过程中触发",
          "params": "SplitterResizeHandler"
        },
        {
          "name": "resize-end",
          "description": "拖拽结束后触发",
          "params": "SplitterResizeHandler"
        },
        {
          "name": "collapse",
          "description": "折叠或恢复面板时触发",
          "params": "SplitterCollapseHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "放置若干 xy-splitter-panel",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "divider",
      "title": "Divider 分割线",
      "description": "用于切分内容区块、弱化分组边界和串联横向操作。",
      "tags": [
        "xy-divider"
      ],
      "exports": [
        "XyDivider"
      ],
      "layer": "base",
      "props": [
        {
          "name": "direction",
          "description": "分割线方向",
          "type": "DividerDirection",
          "default": "'horizontal'"
        },
        {
          "name": "content-position",
          "description": "默认插槽内容的位置",
          "type": "DividerContentPosition",
          "default": "'center'"
        },
        {
          "name": "border-style",
          "description": "分割线样式，兼容 CSS border-style",
          "type": "DividerBorderStyle",
          "default": "'solid'"
        },
        {
          "name": "size",
          "description": "组件尺寸，未传时跟随全局配置",
          "type": "DividerProps[\"size\"]",
          "default": "全局 size / 'md'"
        },
        {
          "name": "status",
          "description": "分割线语义色",
          "type": "DividerProps[\"status\"]",
          "default": "'neutral'"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "分割线上的自定义内容，仅在横向模式下渲染",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "icon",
      "title": "Icon 图标",
      "description": "基于 Iconify 的图标渲染组件，适合搭配按钮、提示和状态说明使用。",
      "tags": [
        "xy-icon"
      ],
      "exports": [
        "XyIcon"
      ],
      "layer": "base",
      "props": [
        {
          "name": "icon",
          "description": "Iconify 图标标识",
          "type": "string",
          "default": "—"
        },
        {
          "name": "size",
          "description": "图标尺寸",
          "type": "number | string",
          "default": "16"
        },
        {
          "name": "rotate",
          "description": "旋转角度",
          "type": "number",
          "default": "0"
        },
        {
          "name": "spin",
          "description": "是否启用旋转动画",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [],
      "slots": [],
      "exposes": []
    },
    {
      "name": "tag",
      "title": "Tag 标签",
      "description": "轻量状态、分类标记和辅助信息组件。",
      "tags": [
        "xy-tag"
      ],
      "exports": [
        "XyTag"
      ],
      "layer": "base",
      "props": [
        {
          "name": "status",
          "description": "状态色",
          "type": "TagProps[\"status\"]",
          "default": "'neutral'"
        },
        {
          "name": "type",
          "description": "兼容旧项目的状态别名，支持 default / primary / success / info / warning / danger",
          "type": "TagProps[\"type\"]",
          "default": "undefined"
        },
        {
          "name": "size",
          "description": "标签尺寸",
          "type": "TagProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "round",
          "description": "是否为圆角样式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "closable",
          "description": "是否显示关闭按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "icon",
          "description": "前置 Iconify 图标",
          "type": "string",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "close",
          "description": "点击关闭按钮时触发",
          "params": "TagCloseHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "标签主内容",
          "props": ""
        },
        {
          "name": "icon",
          "description": "自定义前置图标，优先级低于 icon prop",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "space",
      "title": "Space 间距",
      "description": "给一组元素建立统一间距的基础布局组件。",
      "tags": [
        "xy-space"
      ],
      "exports": [
        "XySpace"
      ],
      "layer": "base",
      "props": [
        {
          "name": "size",
          "description": "间距大小",
          "type": "SpaceProps[\"size\"]",
          "default": "'md'"
        },
        {
          "name": "direction",
          "description": "排列方向",
          "type": "SpaceProps[\"direction\"]",
          "default": "'horizontal'"
        },
        {
          "name": "wrap",
          "description": "是否允许换行",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "align",
          "description": "交叉轴对齐方式",
          "type": "SpaceProps[\"align\"]",
          "default": "'center'"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "被统一排布的内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "tabs",
      "title": "Tabs 标签页",
      "description": "页面分区、局部导航和视图切换的基础页签组件。",
      "tags": [
        "xy-tabs"
      ],
      "exports": [
        "XyTabs"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前激活项",
          "type": "TabsProps[\"modelValue\"]",
          "default": "首个可用项"
        },
        {
          "name": "default-value",
          "description": "非受控场景下的初始激活项",
          "type": "TabsProps[\"defaultValue\"]",
          "default": "undefined"
        },
        {
          "name": "items",
          "description": "页签项配置",
          "type": "TabItem[]",
          "default": "[]"
        },
        {
          "name": "type",
          "description": "页签风格",
          "type": "TabsType",
          "default": "''"
        },
        {
          "name": "tab-position",
          "description": "页签位置",
          "type": "TabsPosition",
          "default": "'top'"
        },
        {
          "name": "closable",
          "description": "是否默认显示关闭按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "addable",
          "description": "是否显示新增按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "editable",
          "description": "是否同时开启新增和关闭能力",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "stretch",
          "description": "是否拉伸平铺页签",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "before-leave",
          "description": "切换前守卫",
          "type": "TabsBeforeLeave",
          "default": "undefined"
        },
        {
          "name": "tabindex",
          "description": "激活页签的 tabindex",
          "type": "string | number",
          "default": "0"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "激活项变化",
          "params": "TabsModelValueChangeHandler"
        },
        {
          "name": "change",
          "description": "切换页签时触发",
          "params": "TabsChangeHandler"
        },
        {
          "name": "tab-click",
          "description": "点击页签时触发",
          "params": "TabsTabClickHandler"
        },
        {
          "name": "edit",
          "description": "新增或关闭页签时触发",
          "params": "TabsEditHandler"
        },
        {
          "name": "tab-remove",
          "description": "关闭页签时触发",
          "params": "TabsTabRemoveHandler"
        },
        {
          "name": "tab-add",
          "description": "点击新增页签时触发",
          "params": "TabsTabAddHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "面板内容，插槽参数为 TabsDefaultSlotProps",
          "props": ""
        },
        {
          "name": "add-icon",
          "description": "自定义新增按钮图标",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "currentName",
          "description": "当前激活页签 key",
          "type": "TabsInstance[\"currentName\"]"
        },
        {
          "name": "scrollToActiveTab",
          "description": "将激活页签滚动到可视区域",
          "type": "TabsInstance[\"scrollToActiveTab\"]"
        }
      ]
    },
    {
      "name": "config-provider",
      "title": "Config Provider 全局配置",
      "description": "统一默认尺寸、命名空间、弹层层级和函数式能力默认项的根配置组件。",
      "tags": [
        "xy-config-provider"
      ],
      "exports": [
        "XyConfigProvider"
      ],
      "layer": "base",
      "props": [
        {
          "name": "namespace",
          "description": "全局命名空间前缀",
          "type": "string",
          "default": "'xy'"
        },
        {
          "name": "locale",
          "description": "全局文案对象，会透传到配置上下文",
          "type": "ConfigProviderProps[\"locale\"]",
          "default": "{}"
        },
        {
          "name": "z-index",
          "description": "弹层类组件的基础层级",
          "type": "number",
          "default": "2000"
        },
        {
          "name": "size",
          "description": "默认尺寸",
          "type": "ConfigProviderProps[\"size\"]",
          "default": "'md'"
        },
        {
          "name": "dialog",
          "description": "Dialog 服务和组件的全局默认配置",
          "type": "DialogGlobalConfig",
          "default": "{}"
        },
        {
          "name": "loading",
          "description": "Loading 的全局默认配置",
          "type": "LoadingGlobalConfig",
          "default": "{}"
        },
        {
          "name": "message",
          "description": "Message 的全局默认配置",
          "type": "MessageGlobalConfig",
          "default": "{}"
        },
        {
          "name": "notification",
          "description": "Notification 的全局默认配置",
          "type": "NotificationGlobalConfig",
          "default": "{}"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "包裹的应用内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "input",
      "title": "Input 输入框",
      "description": "单行文本录入组件，适合搜索、名称和短文本字段。",
      "tags": [
        "xy-input"
      ],
      "exports": [
        "XyInput"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前值",
          "type": "modelValue",
          "default": "''"
        },
        {
          "name": "model-modifiers",
          "description": "v-model 修饰符",
          "type": "({ lazy?: true; number?: true; trim?: true })",
          "default": "{}"
        },
        {
          "name": "id",
          "description": "原生 id",
          "type": "string",
          "default": "—"
        },
        {
          "name": "placeholder",
          "description": "占位文本",
          "type": "string",
          "default": "''"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否显示清空按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clear-icon",
          "description": "自定义清空图标",
          "type": "string",
          "default": "'mdi:close-circle'"
        },
        {
          "name": "show-password",
          "description": "是否显示密码切换按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-word-limit",
          "description": "是否显示字数统计",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "word-limit-position",
          "description": "字数统计位置",
          "type": "wordLimitPosition",
          "default": "'inside'"
        },
        {
          "name": "type",
          "description": "输入类型",
          "type": "('text' | 'textarea' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url')",
          "default": "'text'"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "size",
          "default": "跟随全局配置"
        },
        {
          "name": "maxlength",
          "description": "最大长度",
          "type": "string | number",
          "default": "—"
        },
        {
          "name": "minlength",
          "description": "最小长度",
          "type": "string | number",
          "default": "—"
        },
        {
          "name": "rows",
          "description": "textarea 行数",
          "type": "number",
          "default": "2"
        },
        {
          "name": "resize",
          "description": "textarea resize 方向",
          "type": "resize",
          "default": "'vertical'"
        },
        {
          "name": "autosize",
          "description": "textarea 自动高度",
          "type": "({ minRows?: number; maxRows?: number } | boolean)",
          "default": "false"
        },
        {
          "name": "prefix-icon",
          "description": "前置图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "suffix-icon",
          "description": "后置图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "formatter",
          "description": "显示格式化函数",
          "type": "formatter",
          "default": "—"
        },
        {
          "name": "parser",
          "description": "输入解析函数",
          "type": "parser",
          "default": "—"
        },
        {
          "name": "autocomplete",
          "description": "原生 autocomplete",
          "type": "string",
          "default": "'off'"
        },
        {
          "name": "form",
          "description": "原生 form",
          "type": "string",
          "default": "—"
        },
        {
          "name": "tabindex",
          "description": "原生 tabindex",
          "type": "string | number",
          "default": "—"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "input-style",
          "description": "原生输入框样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        },
        {
          "name": "container-role",
          "description": "输入框容器角色",
          "type": "string",
          "default": "—"
        },
        {
          "name": "autofocus",
          "description": "原生 autofocus",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "aria-label",
          "description": "原生 aria-label",
          "type": "string",
          "default": "—"
        },
        {
          "name": "inputmode",
          "description": "原生 inputmode",
          "type": "HTMLAttributes['inputmode']",
          "default": "—"
        },
        {
          "name": "name",
          "description": "原生 name",
          "type": "string",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "输入值变化时触发",
          "params": "(value: string | number) => void"
        },
        {
          "name": "input",
          "description": "原生输入联动时触发",
          "params": "(value: string | number) => void"
        },
        {
          "name": "change",
          "description": "原生 change 触发时返回当前值",
          "params": "(value: string | number) => void"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "focus",
          "description": "获得焦点时触发",
          "params": "(event: FocusEvent) => void"
        },
        {
          "name": "blur",
          "description": "失去焦点时触发",
          "params": "(event: FocusEvent) => void"
        }
      ],
      "slots": [
        {
          "name": "prepend",
          "description": "输入框前置区域",
          "props": ""
        },
        {
          "name": "append",
          "description": "输入框后置区域",
          "props": ""
        },
        {
          "name": "prefix",
          "description": "输入框前缀内容",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "输入框后缀内容",
          "props": ""
        },
        {
          "name": "password-icon",
          "description": "自定义密码切换图标，接收 InputPasswordIconSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "ref",
          "description": "当前原生输入元素引用",
          "type": "ref"
        },
        {
          "name": "input",
          "description": "单行输入框引用",
          "type": "input"
        },
        {
          "name": "textarea",
          "description": "多行输入框引用",
          "type": "textarea"
        },
        {
          "name": "focus",
          "description": "聚焦输入框",
          "type": "focus"
        },
        {
          "name": "blur",
          "description": "让输入框失焦",
          "type": "blur"
        },
        {
          "name": "select",
          "description": "选中当前文本",
          "type": "select"
        },
        {
          "name": "clear",
          "description": "清空当前值",
          "type": "clear"
        }
      ]
    },
    {
      "name": "auto-complete",
      "title": "AutoComplete 自动完成",
      "description": "用于搜索建议、命中提示和远程联想输入的轻量组件。",
      "tags": [
        "xy-auto-complete"
      ],
      "exports": [
        "XyAutoComplete"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前输入值",
          "type": "string",
          "default": "''"
        },
        {
          "name": "options",
          "description": "建议项列表",
          "type": "AutoCompleteOption<T>[]",
          "default": "—"
        },
        {
          "name": "placeholder",
          "description": "输入占位提示",
          "type": "string",
          "default": "'请输入关键词'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否允许清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "remote",
          "description": "是否启用远程建议模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading",
          "description": "是否展示加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-text",
          "description": "加载态文案",
          "type": "string",
          "default": "'加载中'"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "prefix-icon",
          "description": "输入框前缀图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "suffix-icon",
          "description": "输入框后缀图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "teleported",
          "description": "是否把下拉面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "下拉面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "下拉面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "offset",
          "description": "下拉面板偏移量",
          "type": "number",
          "default": "8"
        },
        {
          "name": "popper-class",
          "description": "下拉面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "下拉面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        },
        {
          "name": "dropdown-min-width",
          "description": "下拉面板最小宽度",
          "type": "string | number",
          "default": "—"
        },
        {
          "name": "dropdown-max-width",
          "description": "下拉面板最大宽度",
          "type": "string | number",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "输入值变化时触发",
          "params": "AutoCompleteValueChangeHandler"
        },
        {
          "name": "change",
          "description": "选择建议项或点击清空后触发",
          "params": "AutoCompleteValueChangeHandler"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "下拉打开或关闭时触发",
          "params": "AutoCompleteVisibleChangeHandler"
        },
        {
          "name": "focus",
          "description": "打开下拉面板时触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "关闭下拉面板时触发",
          "params": "—"
        },
        {
          "name": "search-change",
          "description": "搜索关键词变化时触发",
          "params": "AutoCompleteSearchChangeHandler"
        },
        {
          "name": "select",
          "description": "选择某个建议项时触发",
          "params": "AutoCompleteSelectHandler<T>"
        }
      ],
      "slots": [
        {
          "name": "prefix",
          "description": "输入框前缀内容",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "输入框后缀内容",
          "props": ""
        },
        {
          "name": "loading",
          "description": "自定义加载态内容",
          "props": ""
        },
        {
          "name": "empty",
          "description": "自定义空态内容",
          "props": ""
        },
        {
          "name": "option",
          "description": "自定义建议项内容，接收 AutoCompleteOptionSlotProps<T>",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦输入框",
          "type": "AutoCompleteInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "关闭下拉并让输入框失焦",
          "type": "AutoCompleteInstance[\"blur\"]"
        },
        {
          "name": "open",
          "description": "打开下拉面板",
          "type": "AutoCompleteInstance[\"open\"]"
        },
        {
          "name": "close",
          "description": "关闭下拉面板",
          "type": "AutoCompleteInstance[\"close\"]"
        }
      ]
    },
    {
      "name": "cascader",
      "title": "Cascader 级联选择",
      "description": "用于地区、目录和路径式分类选择的级联选择组件。",
      "tags": [
        "xy-cascader"
      ],
      "exports": [
        "XyCascader"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前选中路径值",
          "type": "CascaderKey[] | null",
          "default": "null"
        },
        {
          "name": "options",
          "description": "级联选项树",
          "type": "CascaderProps[\"options\"]",
          "default": "[]"
        },
        {
          "name": "props",
          "description": "字段映射配置",
          "type": "CascaderFieldNames",
          "default": "{ label: 'label', value: 'value', children: 'children', disabled: 'disabled', leaf: 'leaf' }"
        },
        {
          "name": "placeholder",
          "description": "未选择时的占位提示",
          "type": "CascaderProps[\"placeholder\"]",
          "default": "'请选择'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否允许清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "filterable",
          "description": "是否启用搜索过滤",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "lazy",
          "description": "是否启用懒加载",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "load",
          "description": "懒加载回调",
          "type": "CascaderLoadFunction",
          "default": "undefined"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "CascaderProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "search-placeholder",
          "description": "搜索框占位文案",
          "type": "string",
          "default": "'搜索选项'"
        },
        {
          "name": "teleported",
          "description": "是否把下拉面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "下拉面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "下拉面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "offset",
          "description": "下拉面板偏移量",
          "type": "number",
          "default": "8"
        },
        {
          "name": "popper-class",
          "description": "下拉面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "下拉面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中路径变化时触发",
          "params": "CascaderValueChangeHandler"
        },
        {
          "name": "change",
          "description": "选中路径确认变化或点击清空后触发",
          "params": "CascaderValueChangeHandler"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "面板打开或关闭时触发",
          "params": "CascaderVisibleChangeHandler"
        },
        {
          "name": "focus",
          "description": "打开面板时触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "关闭面板时触发",
          "params": "—"
        },
        {
          "name": "search-change",
          "description": "搜索关键词变化时触发",
          "params": "CascaderSearchChangeHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦触发器",
          "type": "CascaderInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "关闭面板并让触发器失焦",
          "type": "CascaderInstance[\"blur\"]"
        },
        {
          "name": "open",
          "description": "打开下拉面板",
          "type": "CascaderInstance[\"open\"]"
        },
        {
          "name": "close",
          "description": "关闭下拉面板",
          "type": "CascaderInstance[\"close\"]"
        }
      ]
    },
    {
      "name": "radio",
      "title": "Radio 单选框",
      "description": "在多个互斥选项中选择其一的基础表单组件。",
      "tags": [
        "xy-radio",
        "xy-radio-button",
        "xy-radio-group"
      ],
      "exports": [
        "XyRadio",
        "XyRadioButton",
        "XyRadioGroup"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前选中值，仅单独使用时生效",
          "type": "RadioValue",
          "default": "—"
        },
        {
          "name": "value",
          "description": "单选项的值",
          "type": "RadioValue",
          "default": "—"
        },
        {
          "name": "label",
          "description": "展示文案",
          "type": "string",
          "default": "—"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "尺寸",
          "type": "RadioProps[\"size\"]",
          "default": "全局尺寸"
        },
        {
          "name": "name",
          "description": "原生 name 属性",
          "type": "string",
          "default": "—"
        },
        {
          "name": "border",
          "description": "是否显示边框样式",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中值变化时触发",
          "params": "RadioValueChangeHandler"
        },
        {
          "name": "change",
          "description": "用户切换选项时触发",
          "params": "RadioValueChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义标签内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "checkbox",
      "title": "Checkbox 复选框",
      "description": "用于多选场景、标记状态和批量配置选择的基础组件。",
      "tags": [
        "xy-checkbox",
        "xy-checkbox-button",
        "xy-checkbox-group"
      ],
      "exports": [
        "XyCheckbox",
        "XyCheckboxButton",
        "XyCheckboxGroup"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前值",
          "type": "CheckboxValue",
          "default": "undefined"
        },
        {
          "name": "value",
          "description": "当前项值",
          "type": "CheckboxValue",
          "default": "undefined"
        },
        {
          "name": "label",
          "description": "展示文案",
          "type": "string | number | boolean",
          "default": "undefined"
        },
        {
          "name": "indeterminate",
          "description": "是否为中间态，仅控制样式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "checked",
          "description": "非受控场景下是否默认选中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "name",
          "description": "原生 name",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "true-value",
          "description": "选中时的值",
          "type": "string | number",
          "default": "true"
        },
        {
          "name": "false-value",
          "description": "未选中时的值",
          "type": "string | number",
          "default": "false"
        },
        {
          "name": "id",
          "description": "原生 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "border",
          "description": "是否显示边框样式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "tabindex",
          "description": "原生 tabindex",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "aria-label",
          "description": "原生 aria-label",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "aria-controls",
          "description": "原生 aria-controls",
          "type": "string",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中值变化时触发",
          "params": "CheckboxValueChangeHandler"
        },
        {
          "name": "change",
          "description": "用户切换时触发",
          "params": "CheckboxValueChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义标签内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "switch",
      "title": "Switch 开关",
      "description": "用于二值状态切换、功能启停和轻量模式切换的基础组件。",
      "tags": [
        "xy-switch"
      ],
      "exports": [
        "XySwitch"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前值",
          "type": "SwitchProps[\"modelValue\"]",
          "default": "false"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading",
          "description": "是否显示加载态并阻止交互",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "SwitchProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "width",
          "description": "自定义轨道宽度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "inline-prompt",
          "description": "是否把状态内容放到轨道内部",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "inactive-action-icon",
          "description": "未选中时拇指内图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "active-action-icon",
          "description": "选中时拇指内图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "active-icon",
          "description": "选中状态图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "inactive-icon",
          "description": "未选中状态图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "active-text",
          "description": "选中状态文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "inactive-text",
          "description": "未选中状态文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "active-value",
          "description": "选中状态值",
          "type": "SwitchValue",
          "default": "true"
        },
        {
          "name": "inactive-value",
          "description": "未选中状态值",
          "type": "SwitchValue",
          "default": "false"
        },
        {
          "name": "name",
          "description": "原生 name",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "before-change",
          "description": "切换前守卫",
          "type": "SwitchProps[\"beforeChange\"]",
          "default": "undefined"
        },
        {
          "name": "id",
          "description": "原生 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "tabindex",
          "description": "原生 tabindex",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "aria-label",
          "description": "原生 aria-label",
          "type": "string",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "状态变化时触发",
          "params": "SwitchValueChangeHandler"
        },
        {
          "name": "change",
          "description": "用户确认切换后触发",
          "params": "SwitchValueChangeHandler"
        },
        {
          "name": "input",
          "description": "状态变化时同步触发",
          "params": "SwitchValueChangeHandler"
        },
        {
          "name": "focus",
          "description": "获得焦点时触发",
          "params": "SwitchFocusHandler"
        },
        {
          "name": "blur",
          "description": "失去焦点时触发",
          "params": "SwitchFocusHandler"
        }
      ],
      "slots": [
        {
          "name": "active",
          "description": "自定义选中状态内容",
          "props": ""
        },
        {
          "name": "inactive",
          "description": "自定义未选中状态内容",
          "props": ""
        },
        {
          "name": "active-action",
          "description": "自定义选中状态拇指内容",
          "props": ""
        },
        {
          "name": "inactive-action",
          "description": "自定义未选中状态拇指内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦开关",
          "type": "SwitchInstance[\"focus\"]"
        },
        {
          "name": "checked",
          "description": "当前是否处于选中态",
          "type": "SwitchInstance[\"checked\"]"
        }
      ]
    },
    {
      "name": "input-tag",
      "title": "InputTag 标签输入框",
      "description": "适合多标签录入、规则编辑和轻量分类维护的标签输入组件。",
      "tags": [
        "xy-input-tag"
      ],
      "exports": [
        "XyInputTag"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前标签列表",
          "type": "InputTagValue",
          "default": "undefined"
        },
        {
          "name": "max",
          "description": "最大标签数量",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "trigger",
          "description": "提交标签的触发键",
          "type": "InputTagTrigger",
          "default": "'Enter'"
        },
        {
          "name": "draggable",
          "description": "是否启用拖拽排序",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "delimiter",
          "description": "自动拆分标签的分隔符",
          "type": "string | RegExp",
          "default": "''"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否显示清空按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clear-icon",
          "description": "自定义清空图标",
          "type": "string",
          "default": "'mdi:close-circle'"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "autofocus",
          "description": "原生 autofocus",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "id",
          "description": "原生 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "tabindex",
          "description": "原生 tabindex",
          "type": "string | number",
          "default": "0"
        },
        {
          "name": "maxlength",
          "description": "原生 maxlength",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "minlength",
          "description": "原生 minlength",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "placeholder",
          "description": "占位文本",
          "type": "string",
          "default": "''"
        },
        {
          "name": "autocomplete",
          "description": "原生 autocomplete",
          "type": "string",
          "default": "'off'"
        },
        {
          "name": "save-on-blur",
          "description": "失焦时是否保存当前输入",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "aria-label",
          "description": "原生 aria-label",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "name",
          "description": "原生 name",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "tag-status",
          "description": "标签状态色",
          "type": "ComponentStatus",
          "default": "'neutral'"
        },
        {
          "name": "tag-round",
          "description": "标签是否使用圆角样式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "inputmode",
          "description": "原生 inputmode",
          "type": "HTMLAttributes['inputmode']",
          "default": "undefined"
        },
        {
          "name": "input-style",
          "description": "原生输入框样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "标签列表变化时触发",
          "params": "InputTagValueChangeHandler"
        },
        {
          "name": "change",
          "description": "标签列表确认变化时触发",
          "params": "InputTagValueChangeHandler"
        },
        {
          "name": "input",
          "description": "输入框内容变化时触发",
          "params": "InputTagInputHandler"
        },
        {
          "name": "add-tag",
          "description": "新增标签时触发",
          "params": "InputTagAddTagHandler"
        },
        {
          "name": "remove-tag",
          "description": "删除标签时触发",
          "params": "InputTagRemoveTagHandler"
        },
        {
          "name": "drag-tag",
          "description": "拖拽排序完成时触发",
          "params": "InputTagDragTagHandler"
        },
        {
          "name": "focus",
          "description": "获得焦点时触发",
          "params": "InputTagFocusHandler"
        },
        {
          "name": "blur",
          "description": "失去焦点时触发",
          "params": "InputTagFocusHandler"
        },
        {
          "name": "clear",
          "description": "清空全部标签时触发",
          "params": "—"
        }
      ],
      "slots": [
        {
          "name": "prefix",
          "description": "输入框前缀内容",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "输入框后缀内容",
          "props": ""
        },
        {
          "name": "tag",
          "description": "自定义标签内容，接收 InputTagSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "input",
          "description": "原生输入框引用",
          "type": "InputTagInstance[\"input\"]"
        },
        {
          "name": "focus",
          "description": "聚焦输入框",
          "type": "InputTagInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "让输入框失焦",
          "type": "InputTagInstance[\"blur\"]"
        },
        {
          "name": "clear",
          "description": "清空全部标签",
          "type": "InputTagInstance[\"clear\"]"
        }
      ]
    },
    {
      "name": "input-number",
      "title": "Input Number 数字输入框",
      "description": "带步进控制、精度约束和表单校验联动的数值输入组件。",
      "tags": [
        "xy-input-number"
      ],
      "exports": [
        "XyInputNumber"
      ],
      "layer": "base",
      "props": [
        {
          "name": "id",
          "description": "原生 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "model-value",
          "description": "当前值",
          "type": "InputNumberProps[\"modelValue\"]",
          "default": "null"
        },
        {
          "name": "min",
          "description": "最小值",
          "type": "number",
          "default": "Number.MIN_SAFE_INTEGER"
        },
        {
          "name": "max",
          "description": "最大值",
          "type": "number",
          "default": "Number.MAX_SAFE_INTEGER"
        },
        {
          "name": "step",
          "description": "步进值",
          "type": "number",
          "default": "1"
        },
        {
          "name": "step-strictly",
          "description": "是否只允许步长倍数",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "precision",
          "description": "数值精度",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "InputNumberProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "controls",
          "description": "是否显示步进按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "controls-position",
          "description": "控制按钮位置",
          "type": "InputNumberProps[\"controlsPosition\"]",
          "default": "''"
        },
        {
          "name": "value-on-clear",
          "description": "清空后的回写值",
          "type": "InputNumberProps[\"valueOnClear\"]",
          "default": "null"
        },
        {
          "name": "placeholder",
          "description": "占位文本",
          "type": "string",
          "default": "''"
        },
        {
          "name": "name",
          "description": "原生 name",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "aria-label",
          "description": "原生 aria-label",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "inputmode",
          "description": "原生 inputmode",
          "type": "HTMLAttributes['inputmode']",
          "default": "自动推导"
        },
        {
          "name": "align",
          "description": "数值对齐方式",
          "type": "InputNumberProps[\"align\"]",
          "default": "'center'"
        },
        {
          "name": "disabled-scientific",
          "description": "是否禁用 e / E 输入",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "当前值变化时触发",
          "params": "InputNumberValueChangeHandler"
        },
        {
          "name": "input",
          "description": "输入中触发",
          "params": "InputNumberValueChangeHandler"
        },
        {
          "name": "change",
          "description": "确认变更时触发",
          "params": "InputNumberChangeHandler"
        },
        {
          "name": "focus",
          "description": "获得焦点时触发",
          "params": "InputNumberFocusHandler"
        },
        {
          "name": "blur",
          "description": "失去焦点时触发",
          "params": "InputNumberFocusHandler"
        }
      ],
      "slots": [
        {
          "name": "increase-icon",
          "description": "自定义增加按钮图标",
          "props": ""
        },
        {
          "name": "decrease-icon",
          "description": "自定义减少按钮图标",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "input",
          "description": "原生输入框引用",
          "type": "InputNumberInstance[\"input\"]"
        },
        {
          "name": "focus",
          "description": "聚焦输入框",
          "type": "InputNumberInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "让输入框失焦",
          "type": "InputNumberInstance[\"blur\"]"
        },
        {
          "name": "increase",
          "description": "按当前步长增加",
          "type": "InputNumberInstance[\"increase\"]"
        },
        {
          "name": "decrease",
          "description": "按当前步长减少",
          "type": "InputNumberInstance[\"decrease\"]"
        }
      ]
    },
    {
      "name": "rate",
      "title": "Rate 评分",
      "description": "支持半星、清空、文本提示和表单联动的评分组件。",
      "tags": [
        "xy-rate"
      ],
      "exports": [
        "XyRate"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前评分",
          "type": "number | null",
          "default": "0"
        },
        {
          "name": "id",
          "description": "根节点 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "low-threshold",
          "description": "低分阈值",
          "type": "number",
          "default": "2"
        },
        {
          "name": "high-threshold",
          "description": "高分阈值",
          "type": "number",
          "default": "4"
        },
        {
          "name": "max",
          "description": "最大评分项数量",
          "type": "number",
          "default": "5"
        },
        {
          "name": "colors",
          "description": "激活颜色数组或阈值映射",
          "type": "RateColorMap",
          "default": "['#94a3b8', '#f59e0b', '#f97316']"
        },
        {
          "name": "void-color",
          "description": "未激活图标颜色",
          "type": "string",
          "default": "''"
        },
        {
          "name": "disabled-void-color",
          "description": "禁用态未激活图标颜色",
          "type": "string",
          "default": "''"
        },
        {
          "name": "icons",
          "description": "激活图标数组或阈值映射",
          "type": "RateIconMap",
          "default": "['mdi:star', 'mdi:star', 'mdi:star']"
        },
        {
          "name": "void-icon",
          "description": "未激活图标",
          "type": "string",
          "default": "'mdi:star-outline'"
        },
        {
          "name": "disabled-void-icon",
          "description": "禁用态未激活图标",
          "type": "string",
          "default": "'mdi:star-outline'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "allow-half",
          "description": "是否允许半星",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-text",
          "description": "是否显示文本评价",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-score",
          "description": "是否显示分数",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "text-color",
          "description": "评价文本颜色",
          "type": "string",
          "default": "''"
        },
        {
          "name": "texts",
          "description": "评价文本数组",
          "type": "string[]",
          "default": "['极差', '失望', '一般', '满意', '惊喜']"
        },
        {
          "name": "score-template",
          "description": "分数模板，支持 {value} 占位",
          "type": "string",
          "default": "'{value}'"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "RateProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "clearable",
          "description": "是否允许再次点击清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "aria-label",
          "description": "原生 aria-label",
          "type": "string",
          "default": "'评分'"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "当前评分变化时触发",
          "params": "RateValueChangeHandler"
        },
        {
          "name": "change",
          "description": "提交新评分时触发",
          "params": "RateValueChangeHandler"
        },
        {
          "name": "focus",
          "description": "组件获得焦点时触发",
          "params": "RateFocusHandler"
        },
        {
          "name": "blur",
          "description": "组件失去焦点时触发",
          "params": "RateFocusHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "root",
          "description": "根节点引用",
          "type": "RateInstance[\"root\"]"
        },
        {
          "name": "focus",
          "description": "聚焦评分组件",
          "type": "RateInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "让评分组件失焦",
          "type": "RateInstance[\"blur\"]"
        },
        {
          "name": "setCurrentValue",
          "description": "手动设置当前预览评分",
          "type": "RateInstance[\"setCurrentValue\"]"
        },
        {
          "name": "resetCurrentValue",
          "description": "恢复到 model-value",
          "type": "RateInstance[\"resetCurrentValue\"]"
        }
      ]
    },
    {
      "name": "slider",
      "title": "Slider 滑块",
      "description": "支持单值、范围、输入框联动和垂直模式的滑块组件。",
      "tags": [
        "xy-slider"
      ],
      "exports": [
        "XySlider"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前值",
          "type": "SliderValue",
          "default": "0"
        },
        {
          "name": "id",
          "description": "根节点 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "min",
          "description": "最小值",
          "type": "number",
          "default": "0"
        },
        {
          "name": "max",
          "description": "最大值",
          "type": "number",
          "default": "100"
        },
        {
          "name": "step",
          "description": "步长",
          "type": "number",
          "default": "1"
        },
        {
          "name": "show-input",
          "description": "是否显示输入框",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-input-controls",
          "description": "输入框是否显示控制按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "size",
          "description": "滑块尺寸",
          "type": "SliderProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "input-size",
          "description": "输入框尺寸",
          "type": "SliderProps[\"inputSize\"]",
          "default": "跟随 size"
        },
        {
          "name": "show-stops",
          "description": "是否显示步长断点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-tooltip",
          "description": "是否显示 tooltip",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "format-tooltip",
          "description": "tooltip 格式化函数",
          "type": "SliderProps[\"formatTooltip\"]",
          "default": "undefined"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "range",
          "description": "是否为范围选择",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "vertical",
          "description": "是否纵向展示",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "height",
          "description": "纵向模式下的轨道高度",
          "type": "string",
          "default": "'180px'"
        },
        {
          "name": "range-start-label",
          "description": "范围起点的无障碍说明",
          "type": "string",
          "default": "'起始值'"
        },
        {
          "name": "range-end-label",
          "description": "范围终点的无障碍说明",
          "type": "string",
          "default": "'结束值'"
        },
        {
          "name": "format-value-text",
          "description": "aria-valuetext 格式化函数",
          "type": "SliderProps[\"formatValueText\"]",
          "default": "undefined"
        },
        {
          "name": "tooltip-class",
          "description": "tooltip 自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "placement",
          "description": "tooltip 位置",
          "type": "SliderPlacement",
          "default": "'top'"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "persistent",
          "description": "tooltip 隐藏时是否保留 DOM",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "aria-label",
          "description": "单值模式下的无障碍说明",
          "type": "string",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "当前值变化时触发",
          "params": "SliderValueChangeHandler"
        },
        {
          "name": "input",
          "description": "拖拽或输入过程中触发",
          "params": "SliderValueChangeHandler"
        },
        {
          "name": "change",
          "description": "提交变更后触发",
          "params": "SliderValueChangeHandler"
        },
        {
          "name": "focus",
          "description": "拖拽点获得焦点时触发",
          "params": "SliderFocusHandler"
        },
        {
          "name": "blur",
          "description": "拖拽点失去焦点时触发",
          "params": "SliderFocusHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦第一个点",
          "type": "SliderInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "让拖拽点失焦",
          "type": "SliderInstance[\"blur\"]"
        }
      ]
    },
    {
      "name": "date-picker",
      "title": "DatePicker 日期选择器",
      "description": "中后台筛选栏和表单中的日期选择组件，支持日/范围/月/年/周模式。",
      "tags": [
        "xy-date-picker"
      ],
      "exports": [
        "XyDatePicker"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前值",
          "type": "string | [string, string] | null",
          "default": "null"
        },
        {
          "name": "type",
          "description": "选择类型",
          "type": "'date' | 'daterange' | 'month' | 'year' | 'week'",
          "default": "'date'"
        },
        {
          "name": "placeholder",
          "description": "占位文本",
          "type": "string | string[]",
          "default": "'请选择日期'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否支持清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "min",
          "description": "最小可选日期",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "max",
          "description": "最大可选日期",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "format",
          "description": "展示格式",
          "type": "string",
          "default": "跟随 type 默认格式"
        },
        {
          "name": "value-format",
          "description": "输出值格式",
          "type": "string",
          "default": "跟随 type 默认格式"
        },
        {
          "name": "shortcuts",
          "description": "快捷项",
          "type": "DatePickerShortcut[]",
          "default": "[]"
        },
        {
          "name": "disabled-date",
          "description": "自定义禁用日期",
          "type": "(date: Date) => boolean",
          "default": "undefined"
        },
        {
          "name": "separator",
          "description": "范围模式分隔符（当前版本未生效，面板固定使用\"至\"）",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "editable",
          "description": "是否允许手动输入（当前版本未生效）",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "prefix-icon",
          "description": "触发器前置图标（当前版本未生效）",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "suffix-icon",
          "description": "触发器后置图标（当前版本未生效，面板固定使用日历图标）",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "clear-icon",
          "description": "清空图标（当前版本未生效，固定使用 mdi:close-circle）",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "teleported",
          "description": "是否把面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "popper-class",
          "description": "面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "更新日期值",
          "params": "DatePickerValueChangeHandler"
        },
        {
          "name": "change",
          "description": "选中值变化",
          "params": "DatePickerValueChangeHandler"
        },
        {
          "name": "clear",
          "description": "清空日期",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "面板开关状态",
          "params": "DatePickerVisibleChangeHandler"
        },
        {
          "name": "focus",
          "description": "打开面板时触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "关闭面板时触发",
          "params": "—"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "time-picker",
      "title": "TimePicker 时间选择器",
      "description": "支持单值、范围和格式化显示的时间选择器。",
      "tags": [
        "xy-time-picker"
      ],
      "exports": [
        "XyTimePicker"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前值",
          "type": "string | [string, string] | null",
          "default": "null"
        },
        {
          "name": "placeholder",
          "description": "单值占位文本",
          "type": "string",
          "default": "'请选择时间'"
        },
        {
          "name": "start-placeholder",
          "description": "范围开始占位文本",
          "type": "string",
          "default": "'开始时间'"
        },
        {
          "name": "end-placeholder",
          "description": "范围结束占位文本",
          "type": "string",
          "default": "'结束时间'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否支持清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "format",
          "description": "显示与输出格式",
          "type": "string",
          "default": "'HH:mm:ss'"
        },
        {
          "name": "is-range",
          "description": "是否开启范围选择",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "disabled-hours",
          "description": "禁用小时",
          "type": "() => number[]",
          "default": "undefined"
        },
        {
          "name": "disabled-minutes",
          "description": "禁用分钟",
          "type": "(hour: number) => number[]",
          "default": "undefined"
        },
        {
          "name": "disabled-seconds",
          "description": "禁用秒",
          "type": "(hour: number, minute: number) => number[]",
          "default": "undefined"
        },
        {
          "name": "teleported",
          "description": "是否把面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "popper-class",
          "description": "面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "更新时间值",
          "params": "TimePickerModelValueChangeHandler"
        },
        {
          "name": "change",
          "description": "确认值变化",
          "params": "TimePickerChangeHandler"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "面板开关状态",
          "params": "TimePickerVisibleChangeHandler"
        },
        {
          "name": "focus",
          "description": "打开面板触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "关闭面板触发",
          "params": "—"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "time-select",
      "title": "TimeSelect 时间选择",
      "description": "固定时间点下拉选择，适合预约、营业时间和开始/结束时间联动。",
      "tags": [
        "xy-time-select"
      ],
      "exports": [
        "XyTimeSelect"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前选中值",
          "type": "string | null",
          "default": "null"
        },
        {
          "name": "placeholder",
          "description": "占位提示",
          "type": "string",
          "default": "'请选择时间'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否允许清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "start",
          "description": "开始时间",
          "type": "string",
          "default": "'09:00'"
        },
        {
          "name": "end",
          "description": "结束时间",
          "type": "string",
          "default": "'18:00'"
        },
        {
          "name": "step",
          "description": "步长",
          "type": "string",
          "default": "'00:30'"
        },
        {
          "name": "min-time",
          "description": "最小可选时间",
          "type": "string",
          "default": "—"
        },
        {
          "name": "max-time",
          "description": "最大可选时间",
          "type": "string",
          "default": "—"
        },
        {
          "name": "include-end-time",
          "description": "是否把结束时间纳入选项",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "format",
          "description": "展示与回传格式",
          "type": "string",
          "default": "'HH:mm'"
        },
        {
          "name": "validate-event",
          "description": "是否触发表单校验",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "teleported",
          "description": "是否把面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "popper-class",
          "description": "面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中值变化时触发",
          "params": "TimeSelectValueChangeHandler"
        },
        {
          "name": "change",
          "description": "选中时间项或点击清空后触发",
          "params": "TimeSelectValueChangeHandler"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "面板显隐变化时触发",
          "params": "TimeSelectVisibleChangeHandler"
        },
        {
          "name": "focus",
          "description": "打开面板时触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "面板关闭时触发",
          "params": "—"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦触发器",
          "type": "TimeSelectInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "关闭并让触发器失焦",
          "type": "TimeSelectInstance[\"blur\"]"
        },
        {
          "name": "open",
          "description": "打开下拉面板",
          "type": "TimeSelectInstance[\"open\"]"
        },
        {
          "name": "close",
          "description": "关闭下拉面板",
          "type": "TimeSelectInstance[\"close\"]"
        }
      ]
    },
    {
      "name": "select",
      "title": "Select 选择器",
      "description": "单选下拉、搜索过滤和中后台筛选栏的基础选择器。",
      "tags": [
        "xy-select"
      ],
      "exports": [
        "XySelect"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前选中值",
          "type": "SelectValue<T>",
          "default": "null"
        },
        {
          "name": "options",
          "description": "选项列表",
          "type": "SelectOptionItem<T>[]",
          "default": "—"
        },
        {
          "name": "placeholder",
          "description": "未选择时的占位提示",
          "type": "string",
          "default": "'请选择'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否允许清空当前选中值",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "searchable",
          "description": "是否启用搜索输入",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "multiple",
          "description": "是否开启多选",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "collapse-tags",
          "description": "多选时是否折叠标签",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "max-tag-count",
          "description": "折叠前最多展示的标签数",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "remote",
          "description": "是否启用远程搜索",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "allow-create",
          "description": "是否允许按搜索词创建新项",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "no-data-text",
          "description": "无选项时的文案",
          "type": "string",
          "default": "'暂无选项'"
        },
        {
          "name": "no-match-text",
          "description": "搜索无结果时的文案",
          "type": "string",
          "default": "'没有匹配项'"
        },
        {
          "name": "loading",
          "description": "是否处于加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-text",
          "description": "加载态文案",
          "type": "string",
          "default": "'加载中'"
        },
        {
          "name": "search-placeholder",
          "description": "搜索输入占位文案",
          "type": "string",
          "default": "'搜索选项'"
        },
        {
          "name": "create-text",
          "description": "创建项前缀文案",
          "type": "string",
          "default": "'创建'"
        },
        {
          "name": "prefix-icon",
          "description": "触发器前置图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "suffix-icon",
          "description": "触发器后置图标",
          "type": "string",
          "default": "'mdi:chevron-down'"
        },
        {
          "name": "clear-icon",
          "description": "清空图标",
          "type": "string",
          "default": "'mdi:close-circle'"
        },
        {
          "name": "teleported",
          "description": "是否把下拉面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "下拉面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "下拉面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "offset",
          "description": "下拉面板偏移量",
          "type": "number",
          "default": "12"
        },
        {
          "name": "popper-class",
          "description": "下拉面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "下拉面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        },
        {
          "name": "fit-trigger-width",
          "description": "兼容别名；当未显式传 fit-input-width 时，用它控制下拉面板是否跟随触发器宽度，不作为新的主推荐写法",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "fit-input-width",
          "description": "是否让下拉面板跟随触发器宽度",
          "type": "boolean",
          "default": "undefined（未传时回退 fit-trigger-width）"
        },
        {
          "name": "dropdown-min-width",
          "description": "下拉面板最小宽度",
          "type": "string | number",
          "default": "—"
        },
        {
          "name": "dropdown-max-width",
          "description": "下拉面板最大宽度",
          "type": "string | number",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中值变化时触发",
          "params": "SelectValueChangeHandler<T>"
        },
        {
          "name": "change",
          "description": "选中值确认变化时触发",
          "params": "SelectValueChangeHandler<T>"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "下拉打开或关闭时触发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "focus",
          "description": "下拉打开时触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "下拉关闭时触发",
          "params": "—"
        },
        {
          "name": "search-change",
          "description": "搜索关键字变化时触发",
          "params": "(value: string) => void"
        }
      ],
      "slots": [
        {
          "name": "prefix",
          "description": "触发器前缀内容",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "自定义触发器后缀图标",
          "props": ""
        },
        {
          "name": "header",
          "description": "下拉面板头部内容",
          "props": ""
        },
        {
          "name": "footer",
          "description": "下拉面板底部内容",
          "props": ""
        },
        {
          "name": "loading",
          "description": "自定义加载态内容",
          "props": ""
        },
        {
          "name": "empty",
          "description": "自定义空态内容",
          "props": ""
        },
        {
          "name": "option",
          "description": "自定义选项内容，接收 SelectOptionSlotProps<T>",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦触发器",
          "type": "focus"
        },
        {
          "name": "blur",
          "description": "关闭并让触发器失焦",
          "type": "blur"
        },
        {
          "name": "open",
          "description": "打开下拉面板",
          "type": "open"
        },
        {
          "name": "close",
          "description": "关闭下拉面板",
          "type": "close"
        }
      ]
    },
    {
      "name": "tree-select",
      "title": "TreeSelect 树选择",
      "description": "用于组织、目录和权限树单选的层级选择组件。",
      "tags": [
        "xy-tree-select"
      ],
      "exports": [
        "XyTreeSelect"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前选中节点 key",
          "type": "TreeKey | null",
          "default": "null"
        },
        {
          "name": "data",
          "description": "树节点数据",
          "type": "TreeData",
          "default": "[]"
        },
        {
          "name": "node-key",
          "description": "节点唯一标识字段",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "props",
          "description": "树节点字段映射",
          "type": "TreeOptionProps",
          "default": "{ children: 'children', label: 'label', disabled: 'disabled' }"
        },
        {
          "name": "placeholder",
          "description": "未选择时的占位提示",
          "type": "TreeSelectProps[\"placeholder\"]",
          "default": "'请选择节点'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "clearable",
          "description": "是否允许清空",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "filterable",
          "description": "是否启用搜索过滤",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "filter-node-method",
          "description": "自定义节点过滤方法",
          "type": "FilterNodeMethodFunction",
          "default": "undefined"
        },
        {
          "name": "lazy",
          "description": "是否启用懒加载",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "load",
          "description": "懒加载回调",
          "type": "LoadFunction",
          "default": "undefined"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "TreeSelectProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "empty-text",
          "description": "空数据文案",
          "type": "string",
          "default": "'暂无数据'"
        },
        {
          "name": "search-placeholder",
          "description": "搜索框占位文案",
          "type": "string",
          "default": "'搜索节点'"
        },
        {
          "name": "teleported",
          "description": "是否把下拉面板传送到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "下拉面板挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "placement",
          "description": "下拉面板弹出位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "offset",
          "description": "下拉面板偏移量",
          "type": "number",
          "default": "8"
        },
        {
          "name": "popper-class",
          "description": "下拉面板自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "下拉面板自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "选中节点 key 变化时触发",
          "params": "TreeSelectValueChangeHandler"
        },
        {
          "name": "change",
          "description": "选中节点确认变化时触发",
          "params": "TreeSelectValueChangeHandler"
        },
        {
          "name": "clear",
          "description": "点击清空按钮时触发",
          "params": "—"
        },
        {
          "name": "visible-change",
          "description": "面板打开或关闭时触发",
          "params": "TreeSelectVisibleChangeHandler"
        },
        {
          "name": "focus",
          "description": "打开面板时触发",
          "params": "—"
        },
        {
          "name": "blur",
          "description": "关闭面板时触发",
          "params": "—"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "focus",
          "description": "聚焦触发器",
          "type": "TreeSelectInstance[\"focus\"]"
        },
        {
          "name": "blur",
          "description": "关闭面板并让触发器失焦",
          "type": "TreeSelectInstance[\"blur\"]"
        },
        {
          "name": "open",
          "description": "打开下拉面板",
          "type": "TreeSelectInstance[\"open\"]"
        },
        {
          "name": "close",
          "description": "关闭下拉面板",
          "type": "TreeSelectInstance[\"close\"]"
        },
        {
          "name": "filter",
          "description": "主动设置过滤关键词并同步树过滤",
          "type": "TreeSelectInstance[\"filter\"]"
        }
      ]
    },
    {
      "name": "form",
      "title": "Form 表单",
      "description": "组织录入结构和字段级校验的基础表单组件。",
      "tags": [
        "xy-form",
        "xy-form-item"
      ],
      "exports": [
        "XyForm",
        "XyFormItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model",
          "description": "表单数据对象",
          "type": "model",
          "default": "—"
        },
        {
          "name": "rules",
          "description": "校验规则集合",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "label-width",
          "description": "标签宽度",
          "type": "string | number",
          "default": "'112px'"
        },
        {
          "name": "label-position",
          "description": "标签布局方式",
          "type": "labelPosition",
          "default": "'left'"
        },
        {
          "name": "size",
          "description": "表单默认尺寸",
          "type": "size",
          "default": "'md'"
        },
        {
          "name": "inline",
          "description": "是否启用内联布局",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "disabled",
          "description": "是否整表禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "scroll-to-error",
          "description": "校验失败时滚动到首个错误字段",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "validate-on-rule-change",
          "description": "规则变化后是否自动重新校验",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "字段内容区",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "validate()",
          "description": "校验整个表单",
          "type": "validate"
        },
        {
          "name": "validateField(props, trigger?)",
          "description": "校验指定字段",
          "type": "validateField"
        },
        {
          "name": "resetFields(props?)",
          "description": "重置指定字段或整表单",
          "type": "resetFields"
        },
        {
          "name": "clearValidate(props?)",
          "description": "清空指定字段或整表单的校验信息",
          "type": "clearValidate"
        }
      ]
    },
    {
      "name": "upload",
      "title": "Upload 上传",
      "description": "附件上传、图片上传和补充材料提交组件。",
      "tags": [
        "xy-upload"
      ],
      "exports": [
        "XyUpload"
      ],
      "layer": "base",
      "props": [
        {
          "name": "file-list",
          "description": "当前文件列表",
          "type": "UploadFileItem[]",
          "default": "[]"
        },
        {
          "name": "action",
          "description": "上传地址",
          "type": "string",
          "default": "'#'"
        },
        {
          "name": "headers",
          "description": "请求头",
          "type": "UploadProps[\"headers\"]",
          "default": "{}"
        },
        {
          "name": "method",
          "description": "上传方法",
          "type": "string",
          "default": "'post'"
        },
        {
          "name": "data",
          "description": "额外上传参数",
          "type": "UploadProps[\"data\"]",
          "default": "{}"
        },
        {
          "name": "name",
          "description": "文件字段名",
          "type": "string",
          "default": "'file'"
        },
        {
          "name": "accept",
          "description": "原生文件类型限制",
          "type": "string",
          "default": "''"
        },
        {
          "name": "multiple",
          "description": "是否支持多选",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "limit",
          "description": "最大文件数量",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "drag",
          "description": "是否启用拖拽上传",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "directory",
          "description": "是否支持目录选择",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "paste",
          "description": "是否支持粘贴上传",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "tip",
          "description": "上传提示文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "UploadProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "auto-upload",
          "description": "是否自动上传",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "show-file-list",
          "description": "是否显示文件列表",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "with-credentials",
          "description": "是否携带 cookie",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "list-type",
          "description": "文件列表展示类型",
          "type": "UploadListType",
          "default": "'text'"
        },
        {
          "name": "before-upload",
          "description": "上传前钩子",
          "type": "UploadProps[\"beforeUpload\"]",
          "default": "undefined"
        },
        {
          "name": "before-remove",
          "description": "删除前钩子",
          "type": "UploadProps[\"beforeRemove\"]",
          "default": "undefined"
        },
        {
          "name": "on-change",
          "description": "文件选择或状态变化钩子",
          "type": "UploadProps[\"onChange\"]",
          "default": "undefined"
        },
        {
          "name": "on-remove",
          "description": "删除文件钩子",
          "type": "UploadProps[\"onRemove\"]",
          "default": "undefined"
        },
        {
          "name": "on-preview",
          "description": "点击预览钩子",
          "type": "UploadProps[\"onPreview\"]",
          "default": "undefined"
        },
        {
          "name": "preview-file",
          "description": "自定义预览地址解析",
          "type": "UploadProps[\"previewFile\"]",
          "default": "undefined"
        },
        {
          "name": "on-success",
          "description": "上传成功钩子",
          "type": "UploadProps[\"onSuccess\"]",
          "default": "undefined"
        },
        {
          "name": "on-progress",
          "description": "上传进度钩子",
          "type": "UploadProps[\"onProgress\"]",
          "default": "undefined"
        },
        {
          "name": "on-error",
          "description": "上传失败钩子",
          "type": "UploadProps[\"onError\"]",
          "default": "undefined"
        },
        {
          "name": "on-exceed",
          "description": "超限钩子",
          "type": "UploadProps[\"onExceed\"]",
          "default": "undefined"
        },
        {
          "name": "http-request",
          "description": "自定义上传请求实现",
          "type": "UploadRequestHandler",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:fileList",
          "description": "更新文件列表",
          "params": "UploadFileItem[]"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "默认上传区内容",
          "props": ""
        },
        {
          "name": "trigger",
          "description": "自定义上传触发器",
          "props": ""
        },
        {
          "name": "tip",
          "description": "自定义提示文案",
          "props": ""
        },
        {
          "name": "file",
          "description": "自定义文件项渲染",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "submit",
          "description": "手动上传待上传项",
          "type": "UploadInstance[\"submit\"]"
        },
        {
          "name": "abort",
          "description": "取消上传",
          "type": "UploadInstance[\"abort\"]"
        },
        {
          "name": "clearFiles",
          "description": "清空当前文件列表",
          "type": "UploadInstance[\"clearFiles\"]"
        },
        {
          "name": "handleStart",
          "description": "手动把原始文件加入队列",
          "type": "UploadInstance[\"handleStart\"]"
        },
        {
          "name": "handleRemove",
          "description": "手动移除文件项",
          "type": "UploadInstance[\"handleRemove\"]"
        }
      ]
    },
    {
      "name": "alert",
      "title": "Alert 提示",
      "description": "用于页面内承接重要提示、风险提醒和状态说明的非浮层反馈组件。",
      "tags": [
        "xy-alert"
      ],
      "exports": [
        "XyAlert"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "受控显示状态",
          "type": "AlertProps[\"modelValue\"]",
          "default": "undefined"
        },
        {
          "name": "title",
          "description": "提示标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "描述文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "type",
          "description": "提示类型",
          "type": "AlertType",
          "default": "'info'"
        },
        {
          "name": "closable",
          "description": "是否可关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-text",
          "description": "自定义关闭文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "show-icon",
          "description": "是否显示图标",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "center",
          "description": "是否居中显示内容",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "effect",
          "description": "主题风格",
          "type": "AlertEffect",
          "default": "'light'"
        },
        {
          "name": "duration",
          "description": "自动关闭时长，单位毫秒，0 表示不自动关闭",
          "type": "number",
          "default": "0"
        },
        {
          "name": "size",
          "description": "组件尺寸，未传时跟随全局配置",
          "type": "AlertProps[\"size\"]",
          "default": "全局 size / 'md'"
        },
        {
          "name": "variant",
          "description": "布局变体",
          "type": "AlertVariant",
          "default": "'default'"
        },
        {
          "name": "before-close",
          "description": "手动关闭前拦截函数",
          "type": "AlertBeforeCloseFn",
          "default": "undefined"
        },
        {
          "name": "pause-on-hover",
          "description": "自动关闭时悬停是否暂停计时",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "pause-on-focus",
          "description": "自动关闭时聚焦内部元素是否暂停计时",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "pause-on-page-hidden",
          "description": "页面隐藏时是否暂停自动关闭计时",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "collapsible",
          "description": "是否允许折叠描述区",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "default-expanded",
          "description": "折叠描述是否默认展开",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "line-clamp",
          "description": "折叠描述时的裁切行数",
          "type": "number",
          "default": "2"
        },
        {
          "name": "expand-text",
          "description": "折叠态触发器文案",
          "type": "string",
          "default": "'展开详情'"
        },
        {
          "name": "collapse-text",
          "description": "展开态触发器文案",
          "type": "string",
          "default": "'收起详情'"
        }
      ],
      "events": [
        {
          "name": "close",
          "description": "手动关闭提示时触发",
          "params": "AlertCloseHandler"
        },
        {
          "name": "update:model-value",
          "description": "受控模式下同步显示状态",
          "params": "AlertModelValueChangeHandler"
        },
        {
          "name": "auto-close",
          "description": "自动关闭定时器触发时发出",
          "params": "AlertAutoCloseHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "描述区内容",
          "props": ""
        },
        {
          "name": "title",
          "description": "标题内容",
          "props": ""
        },
        {
          "name": "icon",
          "description": "图标内容",
          "props": ""
        },
        {
          "name": "actions",
          "description": "操作区内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "open",
          "description": "打开顶部横幅服务提示",
          "type": "AlertService[\"open\"]"
        },
        {
          "name": "getState",
          "description": "获取当前服务状态的只读快照",
          "type": "AlertService[\"getState\"]"
        },
        {
          "name": "closeAll",
          "description": "清空当前项和等待队列",
          "type": "AlertService[\"closeAll\"]"
        }
      ]
    },
    {
      "name": "message",
      "title": "Message 消息提示",
      "description": "用于承接轻量操作结果、系统反馈和全局提醒的函数式消息提示。",
      "tags": [
        "$message"
      ],
      "exports": [
        "XyMessage"
      ],
      "layer": "base",
      "props": [
        {
          "name": "message",
          "description": "消息内容，支持字符串、VNode 或渲染函数",
          "type": "MessageContent",
          "default": "''"
        },
        {
          "name": "render",
          "description": "自定义渲染函数，优先级高于 message",
          "type": "MessageOptions[\"render\"]",
          "default": "undefined"
        },
        {
          "name": "type",
          "description": "消息类型",
          "type": "MessageType",
          "default": "'info'"
        },
        {
          "name": "plain",
          "description": "是否使用更轻的外观",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "icon",
          "description": "自定义图标名",
          "type": "string",
          "default": "按 type 自动推导"
        },
        {
          "name": "showIcon",
          "description": "是否显示图标",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "dangerouslyUseHTMLString",
          "description": "是否把字符串按 HTML 渲染",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "customClass",
          "description": "自定义 class",
          "type": "string",
          "default": "''"
        },
        {
          "name": "duration",
          "description": "自动关闭时长，单位毫秒，0 表示不自动关闭",
          "type": "number",
          "default": "3000"
        },
        {
          "name": "showClose",
          "description": "是否显示关闭按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "offset",
          "description": "第一条消息距视口的偏移",
          "type": "number",
          "default": "16"
        },
        {
          "name": "placement",
          "description": "消息出现位置",
          "type": "MessagePlacement",
          "default": "'top'"
        },
        {
          "name": "appendTo",
          "description": "自定义挂载容器",
          "type": "string | HTMLElement",
          "default": "document.body"
        },
        {
          "name": "grouping",
          "description": "是否启用消息合并",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "groupKey",
          "description": "显式指定合并键，适合 VNode / render 消息",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "repeatNum",
          "description": "当前重复次数，通常由内部合并逻辑维护",
          "type": "number",
          "default": "1"
        },
        {
          "name": "max",
          "description": "当前宿主下该 placement 的并发消息上限",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "zIndex",
          "description": "自定义层级",
          "type": "number",
          "default": "自动递增"
        },
        {
          "name": "closeOnClick",
          "description": "点击消息主体时是否关闭",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "closeOnPressEscape",
          "description": "按 Esc 时是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "pauseOnHover",
          "description": "悬停时是否暂停自动关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "pauseOnFocus",
          "description": "聚焦消息内部元素时是否暂停自动关闭",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "pauseOnPageHidden",
          "description": "页面隐藏时是否暂停自动关闭",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "resetOnRepeat",
          "description": "合并重复消息时是否重置自动关闭计时",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "transition",
          "description": "自定义过渡名称",
          "type": "string",
          "default": "'xy-message-fade'"
        },
        {
          "name": "beforeClose",
          "description": "关闭前拦截",
          "type": "MessageBeforeCloseFn",
          "default": "undefined"
        },
        {
          "name": "onClick",
          "description": "点击消息时触发",
          "type": "MessageClickHandler",
          "default": "undefined"
        },
        {
          "name": "onClose",
          "description": "消息开始关闭时触发，带关闭原因",
          "type": "MessageLifecycleHandler",
          "default": "undefined"
        },
        {
          "name": "onClosed",
          "description": "消息完全关闭后触发，带关闭原因",
          "type": "MessageLifecycleHandler",
          "default": "undefined"
        }
      ],
      "events": [],
      "slots": [],
      "exposes": []
    },
    {
      "name": "notification",
      "title": "Notification 通知",
      "description": "用于承接可并行阅读的系统反馈、任务广播和全局操作结果提示。",
      "tags": [
        "xy-notification",
        "$notify"
      ],
      "exports": [
        "XyNotification",
        "XyNotificationService"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "受控显示状态",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "title",
          "description": "通知标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "message",
          "description": "通知正文，支持字符串、VNode 或渲染函数",
          "type": "NotificationContent",
          "default": "''"
        },
        {
          "name": "type",
          "description": "通知类型",
          "type": "NotificationProps[\"type\"]",
          "default": "''"
        },
        {
          "name": "duration",
          "description": "自动关闭时长，单位毫秒，0 表示不自动关闭",
          "type": "number",
          "default": "4500"
        },
        {
          "name": "show-close",
          "description": "是否显示关闭按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "custom-class",
          "description": "自定义 class",
          "type": "string",
          "default": "''"
        },
        {
          "name": "icon",
          "description": "自定义图标名称；当 type 有值时会优先使用类型图标",
          "type": "string",
          "default": "''"
        },
        {
          "name": "close-icon",
          "description": "自定义关闭图标名称",
          "type": "string",
          "default": "'mdi:close'"
        },
        {
          "name": "dangerously-use-html-string",
          "description": "是否把字符串正文按 HTML 渲染",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "z-index",
          "description": "自定义当前通知层级",
          "type": "number",
          "default": "自动递增"
        },
        {
          "name": "timer-key",
          "description": "手动刷新自动关闭计时器的版本标记",
          "type": "number",
          "default": "0"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "受控模式下同步显示状态",
          "params": "NotificationModelValueChangeHandler"
        },
        {
          "name": "close",
          "description": "通知开始关闭时触发",
          "params": "NotificationCloseHandler"
        },
        {
          "name": "closed",
          "description": "通知完成关闭后触发",
          "params": "NotificationCloseHandler"
        },
        {
          "name": "click",
          "description": "点击通知主体时触发",
          "params": "NotificationClickHandler"
        }
      ],
      "slots": [
        {
          "name": "title",
          "description": "标题区内容",
          "props": ""
        },
        {
          "name": "default",
          "description": "正文内容",
          "props": ""
        },
        {
          "name": "actions",
          "description": "操作区内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "close",
          "description": "主动关闭当前通知，可显式指定关闭原因",
          "type": "NotificationInstance[\"close\"]"
        },
        {
          "name": "visible",
          "description": "当前通知是否处于可见状态",
          "type": "NotificationInstance[\"visible\"]"
        }
      ]
    },
    {
      "name": "backtop",
      "title": "Backtop 回到顶部",
      "description": "固定在视口角落的回到顶部按钮，支持整页和局部滚动容器。",
      "tags": [
        "xy-backtop"
      ],
      "exports": [
        "XyBacktop"
      ],
      "layer": "base",
      "props": [
        {
          "name": "target",
          "description": "触发滚动监听的目标容器选择器",
          "type": "string",
          "default": "''"
        },
        {
          "name": "visibility-height",
          "description": "滚动高度达到该值后才显示按钮",
          "type": "number",
          "default": "200"
        },
        {
          "name": "right",
          "description": "距离视口右侧的偏移",
          "type": "number",
          "default": "40"
        },
        {
          "name": "bottom",
          "description": "距离视口底部的偏移",
          "type": "number",
          "default": "40"
        }
      ],
      "events": [
        {
          "name": "click",
          "description": "点击按钮时触发",
          "params": "BacktopClickHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义按钮内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "collapse",
      "title": "Collapse 折叠面板",
      "description": "用于收起说明、筛选配置和 FAQ 内容。",
      "tags": [
        "xy-collapse",
        "xy-collapse-item"
      ],
      "exports": [
        "XyCollapse",
        "XyCollapseItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前展开项，手风琴模式下可传单值，非手风琴模式下传数组",
          "type": "CollapseModelValue",
          "default": "[]"
        },
        {
          "name": "accordion",
          "description": "是否启用手风琴模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "expand-icon-position",
          "description": "展开图标位置",
          "type": "CollapseExpandIconPosition",
          "default": "'right'"
        },
        {
          "name": "before-collapse",
          "description": "切换前守卫，返回 false 或 rejected Promise 时阻止切换",
          "type": "CollapseBeforeCollapse",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "展开项变化",
          "params": "CollapseModelValue"
        },
        {
          "name": "change",
          "description": "展开项变化时触发",
          "params": "CollapseModelValue"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "xy-collapse-item 列表",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "activeNames",
          "description": "当前内部维护的展开项列表",
          "type": "CollapseInstance[\"activeNames\"]"
        },
        {
          "name": "setActiveNames",
          "description": "主动写入展开项列表，并同步触发 update:model-value / change",
          "type": "CollapseInstance[\"setActiveNames\"]"
        }
      ]
    },
    {
      "name": "empty",
      "title": "Empty 空状态",
      "description": "用于承接空数据、空搜索结果和首次进入时暂无内容的页面状态。",
      "tags": [
        "xy-empty"
      ],
      "exports": [
        "XyEmpty"
      ],
      "layer": "base",
      "props": [
        {
          "name": "title",
          "description": "标题文案；未传时回退到 locale.emptyTitle 或 '暂无数据'，显式传 '' 时隐藏标题区",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "description",
          "description": "描述文案；未传时回退到 locale.emptyDescription 或 '这里还没有可展示的内容'，显式传 '' 时隐藏描述区",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "image",
          "description": "自定义图片地址",
          "type": "string",
          "default": "''"
        },
        {
          "name": "image-alt",
          "description": "自定义图片的 alt 文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "image-size",
          "description": "图片区域宽度；优先级高于 --xy-empty-image-width",
          "type": "string | number",
          "default": "''"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "image",
          "description": "自定义图片或插画区域",
          "props": ""
        },
        {
          "name": "title",
          "description": "自定义标题内容",
          "props": ""
        },
        {
          "name": "description",
          "description": "自定义描述内容",
          "props": ""
        },
        {
          "name": "default",
          "description": "底部操作区或补充说明",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "loading",
      "title": "Loading 加载",
      "description": "用于容器内或全屏态的数据加载遮罩，支持 directive、service 和全量安装后的 $loading。",
      "tags": [
        "loading",
        "$loading"
      ],
      "exports": [
        "XyLoading"
      ],
      "layer": "base",
      "props": [
        {
          "name": "target",
          "description": "要覆盖的目标元素，支持 CSS 选择器或 HTMLElement",
          "type": "string | HTMLElement",
          "default": "document.body"
        },
        {
          "name": "body",
          "description": "是否把遮罩挂到 document.body",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "fullscreen",
          "description": "是否使用 fullscreen 形态",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "lock",
          "description": "fullscreen 时是否锁定 body 滚动",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "text",
          "description": "加载文案",
          "type": "LoadingText",
          "default": "''"
        },
        {
          "name": "spinner",
          "description": "自定义 spinner class",
          "type": "string",
          "default": "''"
        },
        {
          "name": "background",
          "description": "自定义遮罩背景色",
          "type": "string",
          "default": "''"
        },
        {
          "name": "customClass",
          "description": "遮罩自定义 class",
          "type": "string",
          "default": "''"
        },
        {
          "name": "svg",
          "description": "自定义 SVG 片段",
          "type": "string",
          "default": "''"
        },
        {
          "name": "svgViewBox",
          "description": "自定义 SVG 的 viewBox",
          "type": "string",
          "default": "'0 0 50 50'"
        },
        {
          "name": "visible",
          "description": "当前可见状态；创建时默认显示，也可通过 instance.update({ visible }) 在运行时切换",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "delay",
          "description": "延迟显示时长，单位毫秒",
          "type": "number",
          "default": "0"
        },
        {
          "name": "minDuration",
          "description": "实际显示后的最短可见时长，单位毫秒",
          "type": "number",
          "default": "0"
        },
        {
          "name": "groupKey",
          "description": "service 复用键；相同 key 会复用已有实例",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "beforeClose",
          "description": "关闭前拦截；返回 false 会阻止关闭",
          "type": "LoadingOptions[\"beforeClose\"]",
          "default": "undefined"
        },
        {
          "name": "closed",
          "description": "完全关闭并卸载后触发",
          "type": "LoadingOptions[\"closed\"]",
          "default": "undefined"
        }
      ],
      "events": [],
      "slots": [],
      "exposes": []
    },
    {
      "name": "skeleton",
      "title": "Skeleton 骨架屏",
      "description": "用于承接列表、卡片和详情块在加载过程中的占位反馈。",
      "tags": [
        "xy-skeleton",
        "xy-skeleton-item"
      ],
      "exports": [
        "XySkeleton",
        "XySkeletonItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "animated",
          "description": "是否启用骨架动画",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "count",
          "description": "重复渲染多少组骨架模板",
          "type": "number",
          "default": "1"
        },
        {
          "name": "rows",
          "description": "默认模板下的段落行数",
          "type": "number",
          "default": "3"
        },
        {
          "name": "loading",
          "description": "是否展示骨架，占位结束后渲染默认插槽",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "throttle",
          "description": "骨架切换节流配置，支持数字或对象写法",
          "type": "SkeletonThrottle",
          "default": "0"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "template",
          "description": "自定义骨架模板；当你已经知道页面结构时，用它替换默认段落骨架",
          "props": ""
        },
        {
          "name": "default",
          "description": "loading = false 时渲染真实内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "uiLoading",
          "description": "节流后的最终加载态",
          "type": "SkeletonInstance[\"uiLoading\"]"
        }
      ]
    },
    {
      "name": "result",
      "title": "Result 结果",
      "description": "用于承接提交、校验、审批、同步等操作完成后的结果反馈。",
      "tags": [
        "xy-result"
      ],
      "exports": [
        "XyResult"
      ],
      "layer": "base",
      "props": [
        {
          "name": "title",
          "description": "结果标题",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "description",
          "description": "主描述文案，优先级高于 sub-title / subTitle",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "sub-title",
          "description": "兼容描述字段（对应 TS 类型 subTitle），未传 description 时生效",
          "type": "string",
          "default": "''"
        },
        {
          "name": "icon",
          "description": "图标语义",
          "type": "ResultIconType",
          "default": "undefined"
        },
        {
          "name": "status",
          "description": "当前库风格状态语义，并兼容后台状态码场景",
          "type": "ResultStatus",
          "default": "'neutral'"
        },
        {
          "name": "size",
          "description": "组件尺寸，未传时跟随全局配置",
          "type": "ResultProps[\"size\"]",
          "default": "全局 size / 'md'"
        },
        {
          "name": "variant",
          "description": "视觉变体",
          "type": "ResultVariant",
          "default": "'plain'"
        },
        {
          "name": "icon-size",
          "description": "自定义图标尺寸",
          "type": "string | number",
          "default": "undefined"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "icon",
          "description": "自定义图标区",
          "props": ""
        },
        {
          "name": "title",
          "description": "自定义标题区",
          "props": ""
        },
        {
          "name": "description",
          "description": "主描述区，优先级高于 sub-title",
          "props": ""
        },
        {
          "name": "sub-title",
          "description": "兼容描述插槽，仅在未使用 description 插槽且未传 description prop 时渲染",
          "props": ""
        },
        {
          "name": "default",
          "description": "描述区下方的补充内容",
          "props": ""
        },
        {
          "name": "extra",
          "description": "底部操作区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "tooltip",
      "title": "Tooltip 文字提示",
      "description": "用于承载简短说明，不承载复杂交互内容。",
      "tags": [
        "xy-tooltip"
      ],
      "exports": [
        "XyTooltip"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "受控显示状态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "content",
          "description": "纯文本提示内容",
          "type": "string",
          "default": "''"
        },
        {
          "name": "placement",
          "description": "浮层方向",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'top'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "open-delay",
          "description": "打开延迟，单位毫秒",
          "type": "number",
          "default": "80"
        },
        {
          "name": "close-delay",
          "description": "关闭延迟，单位毫秒",
          "type": "number",
          "default": "60"
        },
        {
          "name": "show-after",
          "description": "打开延迟别名，优先级高于 open-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "hide-after",
          "description": "关闭延迟别名，优先级高于 close-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "enterable",
          "description": "浮层是否允许鼠标进入",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "trigger",
          "description": "触发方式，支持单值或数组",
          "type": "TooltipTrigger | TooltipTrigger[]",
          "default": "'hover'"
        },
        {
          "name": "trigger-keys",
          "description": "触发器键盘切换按键",
          "type": "string[]",
          "default": "['Enter', 'NumpadEnter', 'Space', ' ']"
        },
        {
          "name": "offset",
          "description": "浮层偏移量",
          "type": "number",
          "default": "10"
        },
        {
          "name": "show-arrow",
          "description": "是否显示箭头",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "max-width",
          "description": "提示最大宽度",
          "type": "string | number",
          "default": "240"
        },
        {
          "name": "teleported",
          "description": "是否通过 Teleport 挂载到外层容器",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "Teleport 的挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "persistent",
          "description": "关闭后是否保留 DOM",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "popper-class",
          "description": "浮层容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "浮层容器自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        },
        {
          "name": "aria-label",
          "description": "自定义辅助说明文本",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "effect",
          "description": "视觉主题",
          "type": "('dark' | 'light')",
          "default": "'dark'"
        },
        {
          "name": "raw-content",
          "description": "是否把 content 当作 HTML 字符串渲染",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "transition",
          "description": "过渡动画名称",
          "type": "string",
          "default": "'xy-fade'"
        },
        {
          "name": "virtual-ref",
          "description": "虚拟触发引用",
          "type": "ReferenceElement | null",
          "default": "null"
        },
        {
          "name": "virtual-triggering",
          "description": "是否启用虚拟触发",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "popper-options",
          "description": "高级定位参数",
          "type": "TooltipPopperOptions",
          "default": "undefined"
        },
        {
          "name": "close-on-esc",
          "description": "按下 Escape 是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-outside",
          "description": "点击外部是否关闭",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "开关状态变化",
          "params": "TooltipModelValueChangeHandler"
        },
        {
          "name": "before-show",
          "description": "打开前触发",
          "params": "—"
        },
        {
          "name": "open",
          "description": "打开时触发",
          "params": "—"
        },
        {
          "name": "show",
          "description": "进入过渡结束后触发",
          "params": "—"
        },
        {
          "name": "before-hide",
          "description": "关闭前触发",
          "params": "—"
        },
        {
          "name": "close",
          "description": "关闭时触发",
          "params": "—"
        },
        {
          "name": "hide",
          "description": "离场过渡结束后触发",
          "params": "—"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "触发区域。非虚拟触发时建议保持单一触发根节点",
          "props": ""
        },
        {
          "name": "content",
          "description": "自定义提示内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "triggerRef",
          "description": "当前触发节点引用",
          "type": "TooltipExposed[\"triggerRef\"]"
        },
        {
          "name": "contentRef",
          "description": "当前内容节点引用",
          "type": "TooltipExposed[\"contentRef\"]"
        },
        {
          "name": "show",
          "description": "立即打开 Tooltip",
          "type": "TooltipExposed[\"show\"]"
        },
        {
          "name": "hide",
          "description": "立即关闭 Tooltip",
          "type": "TooltipExposed[\"hide\"]"
        },
        {
          "name": "updatePopper",
          "description": "重新计算定位",
          "type": "TooltipExposed[\"updatePopper\"]"
        },
        {
          "name": "isFocusInsideContent",
          "description": "判断焦点是否位于内容区",
          "type": "TooltipExposed[\"isFocusInsideContent\"]"
        }
      ]
    },
    {
      "name": "popover",
      "title": "Popover 气泡卡片",
      "description": "用于承载轻量说明或交互内容，比 Tooltip 更重，比 Dialog 更轻。",
      "tags": [
        "xy-popover"
      ],
      "exports": [
        "XyPopover"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "是否打开",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "title",
          "description": "标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "content",
          "description": "纯文本内容",
          "type": "string",
          "default": "''"
        },
        {
          "name": "placement",
          "description": "浮层位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom'"
        },
        {
          "name": "width",
          "description": "面板宽度",
          "type": "string | number",
          "default": "320"
        },
        {
          "name": "close-on-outside",
          "description": "点击外部是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-esc",
          "description": "Escape 是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "trigger",
          "description": "触发方式",
          "type": "PopoverTrigger",
          "default": "'click'"
        },
        {
          "name": "open-delay",
          "description": "打开延迟",
          "type": "number",
          "default": "80"
        },
        {
          "name": "close-delay",
          "description": "关闭延迟",
          "type": "number",
          "default": "60"
        },
        {
          "name": "show-after",
          "description": "打开延迟别名，优先级高于 open-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "hide-after",
          "description": "关闭延迟别名，优先级高于 close-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "enterable",
          "description": "浮层是否允许进入",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "offset",
          "description": "浮层偏移量",
          "type": "number",
          "default": "10"
        },
        {
          "name": "show-arrow",
          "description": "是否显示箭头",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "teleported",
          "description": "是否通过 Teleport 挂载到外层容器",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "Teleport 的挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "persistent",
          "description": "关闭后是否保留 DOM",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "popper-class",
          "description": "浮层容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "浮层容器自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "开关状态变化",
          "params": "PopoverModelValueChangeHandler"
        },
        {
          "name": "open",
          "description": "打开时触发",
          "params": "—"
        },
        {
          "name": "close",
          "description": "关闭时触发",
          "params": "—"
        }
      ],
      "slots": [
        {
          "name": "reference",
          "description": "推荐的触发区域插槽，新代码优先使用",
          "props": ""
        },
        {
          "name": "trigger",
          "description": "兼容的触发区域插槽，仅当 reference 未提供时回退生效",
          "props": ""
        },
        {
          "name": "header",
          "description": "自定义头部",
          "props": ""
        },
        {
          "name": "default",
          "description": "面板主体内容，插槽参数为 PopoverDefaultSlotProps",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "popconfirm",
      "title": "Popconfirm 气泡确认框",
      "description": "用于承接轻量确认动作，支持正文插槽、异步确认和虚拟触发。",
      "tags": [
        "xy-popconfirm"
      ],
      "exports": [
        "XyPopconfirm"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "受控显示状态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "title",
          "description": "标题文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "content",
          "description": "纯文本正文；未提供默认插槽时作为正文区兜底",
          "type": "string",
          "default": "''"
        },
        {
          "name": "placement",
          "description": "浮层位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "width",
          "description": "面板宽度，最小值为 150px",
          "type": "string | number",
          "default": "150"
        },
        {
          "name": "open-delay",
          "description": "打开延时白名单属性",
          "type": "number",
          "default": "80"
        },
        {
          "name": "close-delay",
          "description": "关闭延时白名单属性",
          "type": "number",
          "default": "60"
        },
        {
          "name": "show-after",
          "description": "打开延时别名，优先级高于 open-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "hide-after",
          "description": "关闭延时别名，优先级高于 close-delay；确认/取消成功后也遵循该延时",
          "type": "number",
          "default": "200"
        },
        {
          "name": "effect",
          "description": "视觉风格",
          "type": "PopconfirmEffect",
          "default": "'light'"
        },
        {
          "name": "teleported",
          "description": "是否通过 Teleport 挂载到外层容器",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "Teleport 的挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "persistent",
          "description": "关闭后是否保留 DOM",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "offset",
          "description": "浮层偏移量",
          "type": "number",
          "default": "10"
        },
        {
          "name": "trigger-keys",
          "description": "键盘打开键白名单",
          "type": "string[]",
          "default": "Tooltip 内置默认值"
        },
        {
          "name": "show-arrow",
          "description": "是否显示箭头",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-esc",
          "description": "Escape 是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-outside",
          "description": "点击外部是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "popper-class",
          "description": "浮层容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "浮层容器自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        },
        {
          "name": "transition",
          "description": "过渡名称",
          "type": "string",
          "default": "'xy-fade'"
        },
        {
          "name": "popper-options",
          "description": "浮层定位兼容配置子集",
          "type": "TooltipPopperOptions",
          "default": "undefined"
        },
        {
          "name": "icon",
          "description": "前置图标",
          "type": "string",
          "default": "'mdi:help-circle-outline'"
        },
        {
          "name": "icon-color",
          "description": "图标颜色",
          "type": "string",
          "default": "'var(--xy-warning)'"
        },
        {
          "name": "hide-icon",
          "description": "是否隐藏图标",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "confirm-button-text",
          "description": "确认按钮文案；未传时回退到 locale.popconfirmConfirmButtonText 或 '确定'",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "cancel-button-text",
          "description": "取消按钮文案；未传时回退到 locale.popconfirmCancelButtonText 或 '取消'",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "confirm-button-type",
          "description": "确认按钮类型",
          "type": "PopconfirmButtonType",
          "default": "'primary'"
        },
        {
          "name": "cancel-button-type",
          "description": "取消按钮类型",
          "type": "PopconfirmButtonType",
          "default": "'text'"
        },
        {
          "name": "confirm-button-props",
          "description": "透传给确认按钮的补充配置；不会覆盖内部 loading/disabled 和 confirm-button-type",
          "type": "Partial<ButtonProps>",
          "default": "undefined"
        },
        {
          "name": "cancel-button-props",
          "description": "透传给取消按钮的补充配置；不会覆盖内部 loading/disabled 和 cancel-button-type",
          "type": "Partial<ButtonProps>",
          "default": "undefined"
        },
        {
          "name": "before-confirm",
          "description": "确认前置 hook，支持返回 boolean 或 Promise",
          "type": "PopconfirmHook",
          "default": "undefined"
        },
        {
          "name": "before-cancel",
          "description": "取消前置 hook，支持返回 boolean 或 Promise",
          "type": "PopconfirmHook",
          "default": "undefined"
        },
        {
          "name": "virtual-ref",
          "description": "虚拟定位引用",
          "type": "ReferenceElement | null",
          "default": "null"
        },
        {
          "name": "virtual-triggering",
          "description": "是否启用虚拟触发模式",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "开关状态变化",
          "params": "PopconfirmModelValueChangeHandler"
        },
        {
          "name": "before-show",
          "description": "面板即将打开时触发",
          "params": "—"
        },
        {
          "name": "show",
          "description": "面板完成进入后触发",
          "params": "—"
        },
        {
          "name": "before-hide",
          "description": "面板即将关闭时触发",
          "params": "—"
        },
        {
          "name": "hide",
          "description": "面板完成离开后触发",
          "params": "—"
        },
        {
          "name": "open",
          "description": "浮层逻辑打开时触发",
          "params": "—"
        },
        {
          "name": "close",
          "description": "浮层逻辑关闭时触发",
          "params": "—"
        },
        {
          "name": "confirm",
          "description": "确认动作完成后触发",
          "params": "PopconfirmActionHandler"
        },
        {
          "name": "cancel",
          "description": "取消动作完成后触发",
          "params": "PopconfirmActionHandler"
        }
      ],
      "slots": [
        {
          "name": "reference",
          "description": "触发区域；常规模式下通过点击它打开确认框",
          "props": ""
        },
        {
          "name": "default",
          "description": "正文区；插槽参数为 PopconfirmSlotProps",
          "props": ""
        },
        {
          "name": "actions",
          "description": "自定义操作区；插槽参数为 PopconfirmSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "hide",
          "description": "立即关闭确认框",
          "type": "PopconfirmInstance[\"hide\"]"
        },
        {
          "name": "popperRef",
          "description": "面板根节点引用",
          "type": "PopconfirmInstance[\"popperRef\"]"
        }
      ]
    },
    {
      "name": "dropdown",
      "title": "Dropdown 下拉菜单",
      "description": "用于承载操作菜单，而不是承载值选择。",
      "tags": [
        "xy-dropdown",
        "xy-dropdown-menu",
        "xy-dropdown-item"
      ],
      "exports": [
        "XyDropdown",
        "XyDropdownMenu",
        "XyDropdownItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "受控显示状态",
          "type": "DropdownProps[\"modelValue\"]",
          "default": "false"
        },
        {
          "name": "items",
          "description": "兼容模式下的菜单项列表",
          "type": "DropdownItem[]",
          "default": "[]"
        },
        {
          "name": "placement",
          "description": "菜单位置",
          "type": "('top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end')",
          "default": "'bottom-start'"
        },
        {
          "name": "disabled",
          "description": "是否禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "hide-on-click",
          "description": "选择后是否关闭",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "close-on-select",
          "description": "兼容别名，若与 hide-on-click 同时存在以后者为准",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "role",
          "description": "菜单语义",
          "type": "DropdownRole",
          "default": "'menu'"
        },
        {
          "name": "trigger",
          "description": "触发方式，支持单值或数组",
          "type": "DropdownTrigger | DropdownTrigger[]",
          "default": "'hover'"
        },
        {
          "name": "trigger-keys",
          "description": "触发区键盘打开键",
          "type": "string[]",
          "default": "['Enter','NumpadEnter',' ','ArrowDown']"
        },
        {
          "name": "open-delay",
          "description": "hover 打开延迟",
          "type": "number",
          "default": "80"
        },
        {
          "name": "close-delay",
          "description": "hover 关闭延迟",
          "type": "number",
          "default": "120"
        },
        {
          "name": "show-after",
          "description": "打开延迟别名，优先级高于 open-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "hide-after",
          "description": "关闭延迟别名，优先级高于 close-delay",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "max-height",
          "description": "菜单最大高度",
          "type": "string | number",
          "default": "''"
        },
        {
          "name": "teleported",
          "description": "是否通过 Teleport 挂载到外层容器",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "Teleport 的挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "persistent",
          "description": "关闭后是否保留 DOM",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "popper-class",
          "description": "菜单容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "菜单容器自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        },
        {
          "name": "show-arrow",
          "description": "是否显示浮层箭头",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "virtual-ref",
          "description": "虚拟触发引用或虚拟定位引用",
          "type": "ReferenceElement | null",
          "default": "null"
        },
        {
          "name": "virtual-triggering",
          "description": "是否启用虚拟触发模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "split-button",
          "description": "是否切换为分裂按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "button-props",
          "description": "split-button 下透传给按钮的配置",
          "type": "Partial<ButtonProps>",
          "default": "undefined"
        },
        {
          "name": "tabindex",
          "description": "触发区 tab 索引",
          "type": "string | number",
          "default": "0"
        },
        {
          "name": "loop",
          "description": "roving tabindex 是否循环",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "popper-options",
          "description": "定位兼容配置子集",
          "type": "DropdownPopperOptions",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "开关状态变化",
          "params": "DropdownModelValueChangeHandler"
        },
        {
          "name": "select",
          "description": "选择菜单项",
          "params": "DropdownSelectHandler"
        },
        {
          "name": "command",
          "description": "触发命令派发",
          "params": "DropdownCommandHandler"
        },
        {
          "name": "visible-change",
          "description": "菜单开关状态变化",
          "params": "DropdownVisibleChangeHandler"
        },
        {
          "name": "click",
          "description": "split-button 主按钮点击",
          "params": "DropdownClickHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "触发区域，或 split-button 下主按钮内容",
          "props": ""
        },
        {
          "name": "dropdown",
          "description": "菜单内容，主路径推荐承接 xy-dropdown-menu",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "transfer",
      "title": "Transfer 穿梭框",
      "description": "用于成员、权限和资源双栏分配的基础穿梭框组件。",
      "tags": [
        "xy-transfer"
      ],
      "exports": [
        "XyTransfer"
      ],
      "layer": "base",
      "props": [
        {
          "name": "modelValue",
          "description": "已选中项的 key 集合",
          "type": "TransferKey[]",
          "default": "[]"
        },
        {
          "name": "data",
          "description": "可迁移的数据源",
          "type": "TransferItem[]",
          "default": "[]"
        },
        {
          "name": "titles",
          "description": "左右两栏的标题",
          "type": "[string, string]",
          "default": "['源列表', '目标列表']"
        },
        {
          "name": "disabled",
          "description": "是否整体禁用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "filterable",
          "description": "是否显示本地搜索框",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "filterPlaceholder",
          "description": "搜索框占位文案",
          "type": "string",
          "default": "'搜索条目'"
        },
        {
          "name": "size",
          "description": "尺寸",
          "type": "'xs' / 'sm' / 'md' / 'lg' / 'xl'",
          "default": "'md'"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "description": "选中集合变化",
          "params": "(value: TransferKey[])"
        },
        {
          "name": "change",
          "description": "数据迁移后触发",
          "params": "(value: TransferKey[])"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义数据项渲染内容",
          "props": "{ item, checked, side }（item 为 TransferItem）"
        }
      ],
      "exposes": []
    },
    {
      "name": "dialog",
      "title": "Dialog 对话框",
      "description": "用于阻断当前流程的录入、确认和强提示场景。",
      "tags": [
        "xy-dialog"
      ],
      "exports": [
        "XyDialog"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "是否打开对话框",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "title",
          "description": "对话框标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "append-to-body",
          "description": "是否 teleport 到 body",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "append-to",
          "description": "teleport 挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "before-close",
          "description": "关闭前拦截函数，仅拦截内建关闭入口，并透出关闭原因",
          "type": "(done: (cancel?: boolean) => void, reason?: 'close' | 'backdrop' | 'escape' | 'programmatic') => void | Promise<void>",
          "default": "undefined"
        },
        {
          "name": "destroy-on-close",
          "description": "关闭后是否销毁内容",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "close-on-click-modal",
          "description": "点击遮罩是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-press-escape",
          "description": "按下 Escape 是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "lock-scroll",
          "description": "打开时是否锁定 body 滚动",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "modal",
          "description": "是否显示遮罩层",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "modal-class",
          "description": "遮罩容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "panel-class",
          "description": "面板容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "modal-penetrable",
          "description": "无遮罩时是否允许穿透点击背景",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "open-delay",
          "description": "打开延迟，单位毫秒",
          "type": "number",
          "default": "0"
        },
        {
          "name": "close-delay",
          "description": "关闭延迟，单位毫秒",
          "type": "number",
          "default": "0"
        },
        {
          "name": "top",
          "description": "非垂直居中时的顶部偏移",
          "type": "string",
          "default": "'15vh'"
        },
        {
          "name": "width",
          "description": "对话框宽度",
          "type": "string | number",
          "default": "'50%'"
        },
        {
          "name": "z-index",
          "description": "自定义层级",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "center",
          "description": "是否让头部和底部内容居中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "align-center",
          "description": "是否让对话框在视口中垂直居中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "close-icon",
          "description": "自定义关闭图标，增强计划里支持 string | Component",
          "type": "string | Component",
          "default": "'mdi:close'"
        },
        {
          "name": "draggable",
          "description": "是否允许通过头部拖拽对话框",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "overflow",
          "description": "拖拽时是否允许超出视口",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "fullscreen",
          "description": "是否全屏显示",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "maximizable",
          "description": "是否显示最大化/还原按钮",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "resizable",
          "description": "是否允许通过右下角手柄调整尺寸",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "min-width",
          "description": "调整尺寸时的最小宽度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "max-width",
          "description": "调整尺寸时的最大宽度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "min-height",
          "description": "调整尺寸时的最小高度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "max-height",
          "description": "调整尺寸时的最大高度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "sticky-header",
          "description": "是否固定头部",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "sticky-footer",
          "description": "是否固定底部",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "body-max-height",
          "description": "body 区域最大高度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "loading",
          "description": "是否显示 body 内部加载遮罩",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-text",
          "description": "加载文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "header-class",
          "description": "头部区域自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "body-class",
          "description": "主体区域自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "footer-class",
          "description": "底部区域自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "show-close",
          "description": "是否显示右上角关闭按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "header-aria-level",
          "description": "默认标题的 aria-level",
          "type": "string",
          "default": "'2'"
        },
        {
          "name": "transition",
          "description": "自定义过渡配置，支持过渡名或 Vue Transition 对象",
          "type": "string | TransitionProps",
          "default": "'xy-dialog-fade'"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "对话框开关状态变化时触发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "update:fullscreen",
          "description": "最大化/还原切换时触发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "open",
          "description": "打开时触发",
          "params": "—"
        },
        {
          "name": "opened",
          "description": "进入完成后触发",
          "params": "—"
        },
        {
          "name": "close",
          "description": "关闭时触发",
          "params": "—"
        },
        {
          "name": "closed",
          "description": "离开完成后触发",
          "params": "—"
        },
        {
          "name": "open-auto-focus",
          "description": "打开后完成自动聚焦时触发",
          "params": "—"
        },
        {
          "name": "close-auto-focus",
          "description": "关闭后恢复焦点时触发",
          "params": "—"
        },
        {
          "name": "maximize",
          "description": "切换到全屏/最大化时触发",
          "params": "—"
        },
        {
          "name": "restore",
          "description": "从全屏/最大化恢复时触发",
          "params": "—"
        },
        {
          "name": "resize-start",
          "description": "开始调整尺寸时触发",
          "params": "(event: MouseEvent, width: number, height: number) => void"
        },
        {
          "name": "resize",
          "description": "调整尺寸过程中触发",
          "params": "(event: MouseEvent, width: number, height: number) => void"
        },
        {
          "name": "resize-end",
          "description": "结束调整尺寸时触发",
          "params": "(event: MouseEvent, width: number, height: number) => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "对话框主体内容",
          "props": ""
        },
        {
          "name": "header",
          "description": "自定义头部内容，透出 close、titleId、titleClass",
          "props": ""
        },
        {
          "name": "footer",
          "description": "自定义底部操作区",
          "props": ""
        },
        {
          "name": "title",
          "description": "与 header 兼容的旧式标题插槽，建议仅在迁移期使用",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "visible",
          "description": "当前可见状态",
          "type": "visible"
        },
        {
          "name": "dialogContentRef",
          "description": "内容层实例，可继续访问拖拽和尺寸控制方法",
          "type": "dialogContentRef"
        },
        {
          "name": "resetPosition",
          "description": "重置拖拽位移",
          "type": "resetPosition"
        },
        {
          "name": "handleClose",
          "description": "触发内建关闭流程，可显式指定关闭原因",
          "type": "handleClose"
        }
      ]
    },
    {
      "name": "drawer",
      "title": "Drawer 抽屉",
      "description": "用于保留上下文的侧边录入或信息面板。",
      "tags": [
        "xy-drawer"
      ],
      "exports": [
        "XyDrawer"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "是否打开抽屉",
          "type": "DrawerProps[\"modelValue\"]",
          "default": "false"
        },
        {
          "name": "title",
          "description": "抽屉标题；当你完全自定义 header 时，仍建议传入用于可访问名称兜底",
          "type": "string",
          "default": "''"
        },
        {
          "name": "size",
          "description": "抽屉宽度或高度；左右方向作用于宽度，上下方向作用于高度",
          "type": "DrawerProps[\"size\"]",
          "default": "420"
        },
        {
          "name": "placement",
          "description": "项目内保留的打开方向写法",
          "type": "DrawerPlacement",
          "default": "'right'"
        },
        {
          "name": "direction",
          "description": "方向别名，优先级高于 placement",
          "type": "DrawerDirection",
          "default": "undefined"
        },
        {
          "name": "append-to-body",
          "description": "默认是否 teleport 到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-to",
          "description": "teleport 挂载目标；传入后会覆盖 append-to-body",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "modal",
          "description": "是否显示遮罩层",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "modal-class",
          "description": "遮罩层自定义类名，仅在 modal=true 时生效",
          "type": "string",
          "default": "''"
        },
        {
          "name": "modal-penetrable",
          "description": "无遮罩时是否允许背景继续点击",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "close-on-overlay",
          "description": "点击遮罩是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-click-modal",
          "description": "点击遮罩是否关闭的别名配置，优先级高于 close-on-overlay",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "close-on-esc",
          "description": "按下 Escape 是否关闭",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-on-press-escape",
          "description": "Escape 关闭的别名配置，优先级高于 close-on-esc",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "open-delay",
          "description": "打开延迟，单位毫秒",
          "type": "number",
          "default": "0"
        },
        {
          "name": "close-delay",
          "description": "关闭延迟，单位毫秒",
          "type": "number",
          "default": "0"
        },
        {
          "name": "destroy-on-close",
          "description": "关闭后是否销毁内容",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-close",
          "description": "是否显示右上角关闭按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "lock-scroll",
          "description": "打开时是否锁定 body 滚动",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "with-header",
          "description": "是否渲染默认头部容器",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "before-close",
          "description": "关闭前拦截函数，第二个参数会给出触发来源：close、backdrop、escape、programmatic",
          "type": "DrawerProps[\"beforeClose\"]",
          "default": "undefined"
        },
        {
          "name": "resizable",
          "description": "是否允许拖动边缘调整尺寸",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "custom-class",
          "description": "面板自定义类名的兼容别名，建议改用组件原生 class",
          "type": "string",
          "default": "''"
        },
        {
          "name": "header-class",
          "description": "头部容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "body-class",
          "description": "主体容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "footer-class",
          "description": "底部容器自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "z-index",
          "description": "指定抽屉层级",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "header-aria-level",
          "description": "默认标题节点的 aria-level",
          "type": "string | number",
          "default": "2"
        },
        {
          "name": "modal-fade",
          "description": "是否保留遮罩层淡入淡出",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "close-icon",
          "description": "关闭按钮图标，使用图标字符串",
          "type": "string",
          "default": "'mdi:close'"
        },
        {
          "name": "fullscreen",
          "description": "是否让抽屉占满整个视口",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "transition",
          "description": "自定义过渡配置，支持过渡名或 Vue Transition 对象",
          "type": "DrawerTransition",
          "default": "'xy-drawer-fade'"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "开关状态变化",
          "params": "DrawerModelValueChangeHandler"
        },
        {
          "name": "open",
          "description": "打开时触发",
          "params": "—"
        },
        {
          "name": "opened",
          "description": "进入完成后触发",
          "params": "—"
        },
        {
          "name": "close",
          "description": "关闭时触发",
          "params": "—"
        },
        {
          "name": "closed",
          "description": "离开完成后触发",
          "params": "—"
        },
        {
          "name": "open-auto-focus",
          "description": "抽屉打开并完成初始聚焦后触发",
          "params": "—"
        },
        {
          "name": "close-auto-focus",
          "description": "抽屉关闭并恢复焦点后触发",
          "params": "—"
        },
        {
          "name": "resize-start",
          "description": "开始拖拽尺寸时触发",
          "params": "DrawerResizeHandler"
        },
        {
          "name": "resize",
          "description": "拖拽尺寸过程中触发",
          "params": "DrawerResizeHandler"
        },
        {
          "name": "resize-end",
          "description": "结束拖拽尺寸时触发",
          "params": "DrawerResizeHandler"
        }
      ],
      "slots": [
        {
          "name": "header",
          "description": "自定义头部，插槽参数为 DrawerHeaderSlotProps",
          "props": ""
        },
        {
          "name": "default",
          "description": "主体内容",
          "props": ""
        },
        {
          "name": "footer",
          "description": "底部操作区",
          "props": ""
        },
        {
          "name": "title",
          "description": "与 header 类似的兼容插槽，仅用于对齐旧用法，建议优先使用 header；插槽参数为 DrawerTitleSlotProps",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "handleClose",
          "description": "主动触发关闭流程，会经过 before-close 拦截",
          "type": "DrawerInstance[\"handleClose\"]"
        },
        {
          "name": "afterEnter",
          "description": "进入完成回调的兼容 expose，建议优先使用 opened 事件",
          "type": "DrawerInstance[\"afterEnter\"]"
        },
        {
          "name": "afterLeave",
          "description": "离开完成回调的兼容 expose，建议优先使用 closed 事件",
          "type": "DrawerInstance[\"afterLeave\"]"
        }
      ]
    },
    {
      "name": "collapse-transition",
      "title": "Collapse Transition 折叠过渡",
      "description": "为可展开内容提供平滑的高度过渡效果。",
      "tags": [
        "xy-collapse-transition"
      ],
      "exports": [
        "XyCollapseTransition"
      ],
      "layer": "base",
      "props": [],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "需要执行折叠过渡的内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "statistic",
      "title": "Statistic 统计数值",
      "description": "标题、前后缀、精度和自定义格式化的指标展示组件。",
      "tags": [
        "xy-statistic"
      ],
      "exports": [
        "XyStatistic"
      ],
      "layer": "base",
      "props": [
        {
          "name": "value",
          "description": "统计值",
          "type": "number | string",
          "default": "0"
        },
        {
          "name": "title",
          "description": "标题文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "prefix",
          "description": "前缀文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "suffix",
          "description": "后缀文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "precision",
          "description": "小数位数，按四舍五入处理",
          "type": "number",
          "default": "0"
        },
        {
          "name": "decimal-separator",
          "description": "小数分隔符",
          "type": "string",
          "default": "'.'"
        },
        {
          "name": "group-separator",
          "description": "千分位分隔符",
          "type": "string",
          "default": "','"
        },
        {
          "name": "formatter",
          "description": "自定义展示函数",
          "type": "StatisticFormatter",
          "default": "undefined"
        },
        {
          "name": "value-style",
          "description": "数值区域样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "title",
          "description": "自定义标题区域",
          "props": ""
        },
        {
          "name": "prefix",
          "description": "自定义前缀区域",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "自定义后缀区域",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "displayValue",
          "description": "当前实际展示文本",
          "type": "StatisticInstance[\"displayValue\"]"
        }
      ]
    },
    {
      "name": "countdown",
      "title": "Countdown 倒计时",
      "description": "复用 Statistic 外壳的目标时间倒计时组件。",
      "tags": [
        "xy-countdown"
      ],
      "exports": [
        "XyCountdown"
      ],
      "layer": "base",
      "props": [
        {
          "name": "value",
          "description": "目标时间",
          "type": "number | Date | Dayjs",
          "default": "0"
        },
        {
          "name": "format",
          "description": "展示格式串",
          "type": "string",
          "default": "'HH:mm:ss'"
        },
        {
          "name": "title",
          "description": "标题文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "prefix",
          "description": "前缀文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "suffix",
          "description": "后缀文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "value-style",
          "description": "数值区域样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "change",
          "description": "每次倒计时更新时触发",
          "params": "CountdownChangeHandler"
        },
        {
          "name": "finish",
          "description": "倒计时结束时触发",
          "params": "CountdownFinishHandler"
        }
      ],
      "slots": [
        {
          "name": "title",
          "description": "自定义标题区域",
          "props": ""
        },
        {
          "name": "prefix",
          "description": "自定义前缀区域",
          "props": ""
        },
        {
          "name": "suffix",
          "description": "自定义后缀区域",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "displayValue",
          "description": "当前展示文本",
          "type": "CountdownInstance[\"displayValue\"]"
        }
      ]
    },
    {
      "name": "progress",
      "title": "Progress 进度条",
      "description": "支持线形、环形和仪表盘三种形态的进度条组件。",
      "tags": [
        "xy-progress"
      ],
      "exports": [
        "XyProgress"
      ],
      "layer": "base",
      "props": [
        {
          "name": "type",
          "description": "进度条类型",
          "type": "ProgressType",
          "default": "'line'"
        },
        {
          "name": "percentage",
          "description": "当前百分比，会自动收敛到 0 - 100",
          "type": "number",
          "default": "0"
        },
        {
          "name": "status",
          "description": "当前状态",
          "type": "ProgressStatus",
          "default": "''"
        },
        {
          "name": "indeterminate",
          "description": "是否展示不确定进度动画",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "duration",
          "description": "不确定进度或条纹流动的动画时长",
          "type": "number",
          "default": "3"
        },
        {
          "name": "stroke-width",
          "description": "线形轨道高度或圆环描边宽度",
          "type": "number",
          "default": "6"
        },
        {
          "name": "stroke-linecap",
          "description": "圆环描边端点样式",
          "type": "ProgressStrokeLinecap",
          "default": "'round'"
        },
        {
          "name": "text-inside",
          "description": "是否把文本放进线形进度条内部",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "width",
          "description": "circle / dashboard 的画布宽高",
          "type": "number",
          "default": "126"
        },
        {
          "name": "show-text",
          "description": "是否显示进度文案",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "color",
          "description": "自定义颜色，支持字符串、分段数组或函数",
          "type": "ProgressColor",
          "default": "''"
        },
        {
          "name": "striped",
          "description": "是否开启条纹纹理",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "striped-flow",
          "description": "是否开启条纹流动动画",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "format",
          "description": "自定义文案格式化函数",
          "type": "ProgressFormatter",
          "default": "(percentage) => \\${percentage}%\\``"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "自定义进度文案，线形外侧、线形内侧和圆形中心文案都走这个插槽",
          "props": "ProgressDefaultSlotProps"
        }
      ],
      "exposes": []
    },
    {
      "name": "steps",
      "title": "Steps 步骤条",
      "description": "承接审批流、引导流和分阶段任务状态的步骤条组件。",
      "tags": [
        "xy-steps",
        "xy-step"
      ],
      "exports": [
        "XySteps",
        "XyStep"
      ],
      "layer": "base",
      "props": [
        {
          "name": "space",
          "description": "每个步骤项的间距；支持数字和百分比字符串",
          "type": "number | string",
          "default": "''"
        },
        {
          "name": "active",
          "description": "当前激活步骤，从 0 开始计数",
          "type": "number",
          "default": "0"
        },
        {
          "name": "direction",
          "description": "展示方向",
          "type": "StepsDirection",
          "default": "'horizontal'"
        },
        {
          "name": "align-center",
          "description": "是否在横向模式下居中标题和描述",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "simple",
          "description": "是否启用紧凑模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "finish-status",
          "description": "已完成步骤的状态映射",
          "type": "StepsStatus",
          "default": "'finish'"
        },
        {
          "name": "process-status",
          "description": "当前步骤的状态映射",
          "type": "StepsStatus",
          "default": "'process'"
        }
      ],
      "events": [
        {
          "name": "change",
          "description": "active 变化时触发",
          "params": "StepsChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "步骤内容，通常传入多个 xy-step",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "timeline",
      "title": "Timeline 时间线",
      "description": "适合审计流、里程碑和侧栏动态记录的时间线基础组件，支持分组、流程态和紧凑密度。",
      "tags": [
        "xy-timeline",
        "xy-timeline-group",
        "xy-timeline-item"
      ],
      "exports": [
        "XyTimeline",
        "XyTimelineGroup",
        "XyTimelineItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "mode",
          "description": "布局模式；推荐按 start -> end -> alternate -> alternate-reverse 的顺序理解：start 为左侧单线，end 为右侧镜像，后两者为中轴双侧布局",
          "type": "TimelineMode",
          "default": "'start'"
        },
        {
          "name": "reverse",
          "description": "是否反转默认插槽内容顺序",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "density",
          "description": "信息密度；compact 适合抽屉、侧栏和详情区",
          "type": "TimelineDensity",
          "default": "'default'"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "时间线内容，通常传入 xy-timeline-group、xy-timeline-item，也允许混入普通节点",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "scheduler",
      "title": "Scheduler 排期日历",
      "description": "月、周、日排期视图与常见交互能力的高级日历组件。",
      "tags": [
        "xy-scheduler"
      ],
      "exports": [
        "XyScheduler"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前焦点日期",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "view",
          "description": "当前视图",
          "type": "SchedulerView",
          "default": "'month'"
        },
        {
          "name": "views",
          "description": "允许切换的视图列表",
          "type": "SchedulerView[]",
          "default": "['month', 'week', 'day']"
        },
        {
          "name": "events",
          "description": "事件列表",
          "type": "SchedulerEvent[]",
          "default": "[]"
        },
        {
          "name": "locale",
          "description": "日历语言",
          "type": "string",
          "default": "'zh-cn'"
        },
        {
          "name": "editable",
          "description": "是否开启拖拽与 resize",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "droppable",
          "description": "是否允许外部事件拖入",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "selectable",
          "description": "是否允许框选日期区间",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "select-mirror",
          "description": "框选时是否显示镜像态",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "week-start",
          "description": "一周起始日",
          "type": "0 | 1 | 2 | 3 | 4 | 5 | 6",
          "default": "1"
        },
        {
          "name": "height",
          "description": "日历高度",
          "type": "string | number",
          "default": "'auto'"
        },
        {
          "name": "show-now-indicator",
          "description": "是否显示当前时间指示线",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "焦点日期变化",
          "params": "string"
        },
        {
          "name": "update:view",
          "description": "视图变化",
          "params": "SchedulerView"
        },
        {
          "name": "date-click",
          "description": "点击日期单元格",
          "params": "SchedulerDateClickPayload"
        },
        {
          "name": "drop",
          "description": "外部元素落入日历",
          "params": "SchedulerDropPayload"
        },
        {
          "name": "date-select",
          "description": "框选日期区间",
          "params": "SchedulerDateSelectPayload"
        },
        {
          "name": "event-click",
          "description": "点击事件块",
          "params": "SchedulerEventClickPayload"
        },
        {
          "name": "event-change",
          "description": "拖拽或 resize 后触发",
          "params": "SchedulerEventChangePayload"
        },
        {
          "name": "event-receive",
          "description": "接收外部拖入事件",
          "params": "SchedulerEventReceivePayload"
        },
        {
          "name": "view-change",
          "description": "视图区间变化",
          "params": "SchedulerViewChangePayload"
        }
      ],
      "slots": [
        {
          "name": "event-content",
          "description": "自定义事件块内容",
          "props": ""
        },
        {
          "name": "day-cell-content",
          "description": "自定义日期单元格内容",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "getApi",
          "description": "获取底层 FullCalendar 实例 API；可用于主动翻页、切换视图或读取当前日历状态",
          "type": "SchedulerInstance[\"getApi\"]"
        }
      ]
    },
    {
      "name": "descriptions",
      "title": "Descriptions 描述列表",
      "description": "用于详情页、审核页和只读信息块的描述列表组件。",
      "tags": [
        "xy-descriptions",
        "xy-descriptions-item"
      ],
      "exports": [
        "XyDescriptions",
        "XyDescriptionsItem"
      ],
      "layer": "base",
      "props": [
        {
          "name": "column",
          "description": "列数",
          "type": "number",
          "default": "3"
        },
        {
          "name": "border",
          "description": "是否展示边框",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "size",
          "description": "组件尺寸",
          "type": "DescriptionsProps[\"size\"]",
          "default": "跟随全局配置"
        },
        {
          "name": "title",
          "description": "标题文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "extra",
          "description": "额外说明",
          "type": "string",
          "default": "''"
        },
        {
          "name": "label-width",
          "description": "标签宽度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "direction",
          "description": "布局方向",
          "type": "DescriptionsProps[\"direction\"]",
          "default": "'horizontal'"
        },
        {
          "name": "collapse",
          "description": "是否默认收起并显示折叠切换",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "items",
          "description": "数据驱动条目数组",
          "type": "DescriptionsDataItem[]",
          "default": "[]"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "default",
          "description": "条目内容",
          "props": ""
        },
        {
          "name": "title",
          "description": "自定义标题区",
          "props": ""
        },
        {
          "name": "extra",
          "description": "自定义额外区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "tree",
      "title": "Tree 树形控件",
      "description": "数据驱动树形控件，覆盖勾选联动、过滤、懒加载、节点路径和拖拽编排。",
      "tags": [
        "xy-tree"
      ],
      "exports": [
        "XyTree"
      ],
      "layer": "base",
      "props": [
        {
          "name": "data",
          "description": "树节点数据",
          "type": "TreeData",
          "default": "[]"
        },
        {
          "name": "empty-text",
          "description": "默认空态描述文案",
          "type": "string",
          "default": "'暂无数据'"
        },
        {
          "name": "node-key",
          "description": "节点唯一 key 字段名；涉及 key 的回显和方法时必填",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "props",
          "description": "节点字段映射",
          "type": "TreeOptionProps",
          "default": "{ children: 'children', label: 'label', disabled: 'disabled' }"
        },
        {
          "name": "render-after-expand",
          "description": "是否首次展开后再渲染子节点",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "highlight-current",
          "description": "是否高亮当前节点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "default-expand-all",
          "description": "是否默认展开全部节点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "expand-on-click-node",
          "description": "点击节点内容时是否触发展开/收起",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "show-checkbox",
          "description": "是否显示勾选框",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "check-strictly",
          "description": "勾选时是否取消父子联动",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "check-descendants",
          "description": "懒加载节点勾选时是否继续把勾选状态传播到后代",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "check-on-click-node",
          "description": "点击节点时是否直接切换勾选状态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "check-on-click-leaf",
          "description": "点击叶子节点时是否直接切换勾选状态",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "default-checked-keys",
          "description": "默认勾选节点 key 列表",
          "type": "TreeKey[]",
          "default": "undefined"
        },
        {
          "name": "default-expanded-keys",
          "description": "默认展开节点 key 列表",
          "type": "TreeKey[]",
          "default": "undefined"
        },
        {
          "name": "current-node-key",
          "description": "当前节点 key，受控回显",
          "type": "TreeKey | null",
          "default": "undefined"
        },
        {
          "name": "filter-node-method",
          "description": "节点过滤函数",
          "type": "TreeProps[\"filterNodeMethod\"]",
          "default": "undefined"
        },
        {
          "name": "lazy",
          "description": "是否启用懒加载节点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "load",
          "description": "懒加载回调",
          "type": "TreeProps[\"load\"]",
          "default": "undefined"
        },
        {
          "name": "draggable",
          "description": "是否启用节点拖拽",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "allow-drag",
          "description": "控制节点是否允许被拖动",
          "type": "AllowDragFunction",
          "default": "undefined"
        },
        {
          "name": "allow-drop",
          "description": "控制目标节点的 prev / inner / next 三种落点是否允许放置",
          "type": "AllowDropFunction",
          "default": "undefined"
        },
        {
          "name": "accordion",
          "description": "是否同级只保留一个展开节点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "indent",
          "description": "相邻层级缩进宽度",
          "type": "number",
          "default": "18"
        },
        {
          "name": "icon",
          "description": "自定义展开图标",
          "type": "string | Component",
          "default": "'mdi:chevron-right'"
        },
        {
          "name": "render-content",
          "description": "渲染函数形式的节点内容自定义",
          "type": "TreeProps[\"renderContent\"]",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "node-click",
          "description": "点击节点内容时触发",
          "params": "TreeNodeClickHandler"
        },
        {
          "name": "node-contextmenu",
          "description": "右键节点时触发",
          "params": "TreeNodeContextmenuHandler"
        },
        {
          "name": "current-change",
          "description": "当前节点变化时触发",
          "params": "TreeCurrentChangeHandler"
        },
        {
          "name": "node-expand",
          "description": "节点展开时触发",
          "params": "TreeNodeExpandHandler"
        },
        {
          "name": "node-collapse",
          "description": "节点收起时触发",
          "params": "TreeNodeCollapseHandler"
        },
        {
          "name": "node-drag-start",
          "description": "节点开始拖拽时触发",
          "params": "TreeNodeDragStartHandler"
        },
        {
          "name": "node-drag-enter",
          "description": "拖拽节点进入目标节点时触发",
          "params": "TreeNodeDragEnterHandler"
        },
        {
          "name": "node-drag-leave",
          "description": "拖拽节点离开目标节点时触发",
          "params": "TreeNodeDragLeaveHandler"
        },
        {
          "name": "node-drag-over",
          "description": "拖拽节点在目标节点上移动时触发",
          "params": "TreeNodeDragOverHandler"
        },
        {
          "name": "node-drag-end",
          "description": "拖拽结束时触发，即使没有成功放置也会触发",
          "params": "TreeNodeDragEndHandler"
        },
        {
          "name": "node-drop",
          "description": "节点成功放置后触发",
          "params": "TreeNodeDropHandler"
        },
        {
          "name": "check-change",
          "description": "单个节点勾选状态变化时触发",
          "params": "TreeCheckChangeHandler"
        },
        {
          "name": "check",
          "description": "点击勾选框后触发",
          "params": "TreeCheckHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义节点内容",
          "props": "RenderContentContext"
        },
        {
          "name": "empty",
          "description": "自定义空态内容",
          "props": "—"
        }
      ],
      "exposes": [
        {
          "name": "filter",
          "description": "过滤全部节点",
          "type": "TreeExposes[\"filter\"]"
        },
        {
          "name": "updateKeyChildren",
          "description": "替换某个节点的直接子节点，依赖 node-key",
          "type": "TreeExposes[\"updateKeyChildren\"]"
        },
        {
          "name": "getNodePath",
          "description": "获取某个节点从根到当前项的路径，依赖 node-key",
          "type": "TreeExposes[\"getNodePath\"]"
        },
        {
          "name": "getCheckedNodes",
          "description": "获取勾选节点数据",
          "type": "TreeExposes[\"getCheckedNodes\"]"
        },
        {
          "name": "setCheckedNodes",
          "description": "按节点数据设置勾选状态",
          "type": "TreeExposes[\"setCheckedNodes\"]"
        },
        {
          "name": "getCheckedKeys",
          "description": "获取勾选节点 key",
          "type": "TreeExposes[\"getCheckedKeys\"]"
        },
        {
          "name": "setCheckedKeys",
          "description": "按 key 设置勾选状态，依赖 node-key",
          "type": "TreeExposes[\"setCheckedKeys\"]"
        },
        {
          "name": "setChecked",
          "description": "设置单个节点勾选状态",
          "type": "TreeExposes[\"setChecked\"]"
        },
        {
          "name": "getHalfCheckedNodes",
          "description": "获取半选节点数据",
          "type": "TreeExposes[\"getHalfCheckedNodes\"]"
        },
        {
          "name": "getHalfCheckedKeys",
          "description": "获取半选节点 key",
          "type": "TreeExposes[\"getHalfCheckedKeys\"]"
        },
        {
          "name": "getCurrentKey",
          "description": "获取当前节点 key",
          "type": "TreeExposes[\"getCurrentKey\"]"
        },
        {
          "name": "getCurrentNode",
          "description": "获取当前节点数据",
          "type": "TreeExposes[\"getCurrentNode\"]"
        },
        {
          "name": "setCurrentKey",
          "description": "按 key 设置当前节点",
          "type": "TreeExposes[\"setCurrentKey\"]"
        },
        {
          "name": "setCurrentNode",
          "description": "按节点数据或节点实例设置当前节点",
          "type": "TreeExposes[\"setCurrentNode\"]"
        },
        {
          "name": "getNode",
          "description": "根据 key 或节点数据获取节点实例",
          "type": "TreeExposes[\"getNode\"]"
        },
        {
          "name": "remove",
          "description": "删除节点",
          "type": "TreeExposes[\"remove\"]"
        },
        {
          "name": "append",
          "description": "追加子节点",
          "type": "TreeExposes[\"append\"]"
        },
        {
          "name": "insertBefore",
          "description": "在指定节点前插入新节点",
          "type": "TreeExposes[\"insertBefore\"]"
        },
        {
          "name": "insertAfter",
          "description": "在指定节点后插入新节点",
          "type": "TreeExposes[\"insertAfter\"]"
        }
      ]
    },
    {
      "name": "table",
      "title": "Table 表格",
      "description": "后台表格组件，支持列树、选择列、展开行、树形数据、固定列、汇总行和实例方法。",
      "tags": [
        "xy-table",
        "xy-table-column"
      ],
      "exports": [
        "XyTable",
        "XyTableColumn"
      ],
      "layer": "base",
      "props": [
        {
          "name": "data",
          "description": "数据源",
          "type": "T[]",
          "default": "[]"
        },
        {
          "name": "row-key",
          "description": "行唯一标识字段或函数",
          "type": "TableProps<T>[\"rowKey\"]",
          "default": "undefined"
        },
        {
          "name": "size",
          "description": "表格尺寸",
          "type": "size",
          "default": "'md'"
        },
        {
          "name": "overview",
          "description": "是否启用概览态节奏，适合 dashboard / 首屏摘要类表格",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "width",
          "description": "表格根节点宽度",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "height",
          "description": "固定高度，超过后表体滚动",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "max-height",
          "description": "最大高度，超过后表体滚动",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "fit",
          "description": "是否让列宽自适应容器宽度",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "stripe",
          "description": "是否显示斑马纹",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "border",
          "description": "是否显示完整边框和纵向分割线",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "show-header",
          "description": "是否显示表头",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "show-summary",
          "description": "是否显示汇总行",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "sum-text",
          "description": "汇总行第一列文案",
          "type": "string",
          "default": "'合计'"
        },
        {
          "name": "summary-method",
          "description": "自定义汇总行计算",
          "type": "TableProps<T>[\"summaryMethod\"]",
          "default": "undefined"
        },
        {
          "name": "empty-text",
          "description": "默认空态文案",
          "type": "string",
          "default": "'暂无数据'"
        },
        {
          "name": "loading",
          "description": "是否显示加载态遮罩",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-text",
          "description": "默认加载文案",
          "type": "string",
          "default": "'Loading...'"
        },
        {
          "name": "highlight-current-row",
          "description": "是否高亮当前行",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "current-row-key",
          "description": "当前行 key，受控模式",
          "type": "TableProps<T>[\"currentRowKey\"]",
          "default": "undefined"
        },
        {
          "name": "default-current-row-key",
          "description": "当前行 key 的非受控初始值",
          "type": "TableProps<T>[\"defaultCurrentRowKey\"]",
          "default": "null"
        },
        {
          "name": "default-sort",
          "description": "默认排序配置；只传 prop 时会默认按升序生效",
          "type": "{ prop?: string; order?: 'ascending' | 'descending' | null }",
          "default": "{ prop: undefined, order: undefined }"
        },
        {
          "name": "expand-row-keys",
          "description": "展开行 key 列表",
          "type": "TableProps<T>[\"expandRowKeys\"]",
          "default": "undefined"
        },
        {
          "name": "default-expand-all",
          "description": "是否默认展开全部可展开行/树节点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "row-expandable",
          "description": "控制 type=\"expand\" 行是否可展开",
          "type": "TableProps<T>[\"rowExpandable\"]",
          "default": "undefined"
        },
        {
          "name": "span-method",
          "description": "单元格合并逻辑",
          "type": "TableProps<T>[\"spanMethod\"]",
          "default": "undefined"
        },
        {
          "name": "select-on-indeterminate",
          "description": "头部勾选在半选态下是否直接全选",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "indent",
          "description": "树形缩进宽度",
          "type": "number",
          "default": "16"
        },
        {
          "name": "tree-props",
          "description": "树形字段配置",
          "type": "{ hasChildren?: string; children?: string; checkStrictly?: boolean }",
          "default": "{ children: 'children', hasChildren: 'hasChildren', checkStrictly: false }"
        },
        {
          "name": "lazy",
          "description": "是否启用懒加载树节点",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "load",
          "description": "懒加载回调",
          "type": "TableProps<T>[\"load\"]",
          "default": "undefined"
        },
        {
          "name": "table-layout",
          "description": "表格布局算法",
          "type": "('fixed' | 'auto')",
          "default": "'fixed'"
        },
        {
          "name": "show-overflow-tooltip",
          "description": "是否为默认文本链路统一开启溢出 tooltip，可传 tooltip 配置对象",
          "type": "boolean | { effect?: 'dark' | 'light'; enterable?: boolean; hideAfter?: number; offset?: number; placement?: Placement; popperClass?: string; showAfter?: number; showArrow?: boolean }",
          "default": "false"
        },
        {
          "name": "tooltip-effect",
          "description": "全表默认溢出 tooltip 主题",
          "type": "tooltipEffect",
          "default": "undefined"
        },
        {
          "name": "tooltip-options",
          "description": "全表默认溢出 tooltip 配置",
          "type": "{ effect?: 'dark' | 'light'; enterable?: boolean; hideAfter?: number; offset?: number; placement?: Placement; popperClass?: string; showAfter?: number; showArrow?: boolean }",
          "default": "undefined"
        },
        {
          "name": "tooltip-formatter",
          "description": "自定义溢出 tooltip 文案",
          "type": "TableProps<T>[\"tooltipFormatter\"]",
          "default": "undefined"
        },
        {
          "name": "append-filter-panel-to",
          "description": "指定筛选面板挂载节点选择器",
          "type": "string",
          "default": "''"
        },
        {
          "name": "row-class-name",
          "description": "行 class 或 class 计算函数",
          "type": "TableRowClassName<T>",
          "default": "''"
        },
        {
          "name": "row-style",
          "description": "行样式或样式计算函数",
          "type": "TableRowStyle<T>",
          "default": "undefined"
        },
        {
          "name": "cell-class-name",
          "description": "单元格 class 或 class 计算函数",
          "type": "TableProps<T>[\"cellClassName\"]",
          "default": "''"
        },
        {
          "name": "cell-style",
          "description": "单元格样式或样式计算函数",
          "type": "TableProps<T>[\"cellStyle\"]",
          "default": "undefined"
        },
        {
          "name": "header-row-class-name",
          "description": "表头行 class 或 class 计算函数",
          "type": "TableHeaderRowClassName",
          "default": "''"
        },
        {
          "name": "header-row-style",
          "description": "表头行样式或样式计算函数",
          "type": "TableHeaderRowStyle",
          "default": "undefined"
        },
        {
          "name": "header-cell-class-name",
          "description": "表头单元格 class 或 class 计算函数",
          "type": "TableHeaderCellClassName<T>",
          "default": "''"
        },
        {
          "name": "header-cell-style",
          "description": "表头单元格样式或样式计算函数",
          "type": "TableHeaderCellStyle<T>",
          "default": "undefined"
        },
        {
          "name": "class-name",
          "description": "表格根节点附加 class",
          "type": "string",
          "default": "''"
        },
        {
          "name": "style",
          "description": "表格根节点附加样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        },
        {
          "name": "clickable",
          "description": "是否把主表体行视为可点击项，并补齐键盘聚焦与回车触发",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "scrollbar-always-on",
          "description": "是否为滚动容器保留稳定滚动条槽位",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "scrollbar-tabindex",
          "description": "表体滚动容器的 tabindex",
          "type": "string | number",
          "default": "undefined"
        },
        {
          "name": "flexible",
          "description": "是否让表格所在的 flex 子项自动解除最小宽度限制",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "native-scrollbar",
          "description": "是否使用原生滚动条而不是自定义滚动条",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "allow-drag-last-column",
          "description": "是否允许拖拽当前渲染带中的最后一个叶子列",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "preserve-expanded-content",
          "description": "折叠展开行后是否保留其 DOM",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "aria-label",
          "description": "表格容器的无障碍名称",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "aria-labelledby",
          "description": "关联表格标题元素 id",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "aria-describedby",
          "description": "关联表格说明元素 id",
          "type": "string",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "row-click",
          "description": "行点击或键盘触发时派发",
          "params": "TableRowClickHandler<T>"
        },
        {
          "name": "row-dblclick",
          "description": "行双击时派发",
          "params": "TableRowMouseHandler<T>"
        },
        {
          "name": "row-contextmenu",
          "description": "行右键时派发",
          "params": "TableRowMouseHandler<T>"
        },
        {
          "name": "cell-click",
          "description": "单元格点击时派发",
          "params": "TableCellMouseHandler<T>"
        },
        {
          "name": "cell-dblclick",
          "description": "单元格双击时派发",
          "params": "TableCellMouseHandler<T>"
        },
        {
          "name": "cell-contextmenu",
          "description": "单元格右键时派发",
          "params": "TableCellMouseHandler<T>"
        },
        {
          "name": "cell-mouse-enter",
          "description": "鼠标进入单元格时派发",
          "params": "TableCellMouseHandler<T>"
        },
        {
          "name": "cell-mouse-leave",
          "description": "鼠标离开单元格时派发",
          "params": "TableCellMouseHandler<T>"
        },
        {
          "name": "header-click",
          "description": "表头点击时派发",
          "params": "TableHeaderMouseHandler<T>"
        },
        {
          "name": "header-contextmenu",
          "description": "表头右键时派发",
          "params": "TableHeaderMouseHandler<T>"
        },
        {
          "name": "header-dragend",
          "description": "列拖拽结束时派发",
          "params": "TableHeaderDragendHandler<T>"
        },
        {
          "name": "selection-change",
          "description": "选择结果变化时派发",
          "params": "TableSelectionChangeHandler<T>"
        },
        {
          "name": "select",
          "description": "单行选择变化时派发",
          "params": "TableSelectHandler<T>"
        },
        {
          "name": "select-all",
          "description": "头部全选变化时派发",
          "params": "TableSelectionChangeHandler<T>"
        },
        {
          "name": "current-change",
          "description": "当前高亮行变化时派发",
          "params": "TableCurrentChangeHandler<T>"
        },
        {
          "name": "sort-change",
          "description": "排序变化时派发",
          "params": "TableSortChangePayload<T>"
        },
        {
          "name": "filter-change",
          "description": "筛选变化时派发",
          "params": "(value: Record<string, (string | number | boolean)[]>) => void"
        },
        {
          "name": "expand-change",
          "description": "展开行或树节点变化时派发",
          "params": "TableExpandChangeHandler<T>"
        },
        {
          "name": "scroll",
          "description": "表体滚动、固定列联动滚动或实例方法滚动后派发",
          "params": "{ scrollLeft: number; scrollTop: number }"
        },
        {
          "name": "update:currentRowKey",
          "description": "当前行 key 更新",
          "params": "TableCurrentRowKeyChangeHandler"
        },
        {
          "name": "update:sortProp",
          "description": "兼容排序列更新",
          "params": "TableSortPropChangeHandler"
        },
        {
          "name": "update:sortOrder",
          "description": "兼容排序方向更新",
          "params": "TableSortOrderChangeHandler"
        },
        {
          "name": "update:filterValues",
          "description": "兼容筛选状态更新",
          "params": "TableFilterValuesChangeHandler"
        },
        {
          "name": "update:expandRowKeys",
          "description": "展开行 key 更新",
          "params": "TableExpandRowKeysChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "列定义区，只接收 xy-table-column",
          "props": ""
        },
        {
          "name": "loading",
          "description": "自定义加载态内容",
          "props": ""
        },
        {
          "name": "empty",
          "description": "自定义空态内容",
          "props": ""
        },
        {
          "name": "append",
          "description": "渲染在表体末尾、汇总行之前的附加区域",
          "props": ""
        }
      ],
      "exposes": [
        {
          "name": "clearSelection",
          "description": "清空当前选择",
          "type": "TableInstance<T>[\"clearSelection\"]"
        },
        {
          "name": "getSelectionRows",
          "description": "获取当前选择行",
          "type": "TableInstance<T>[\"getSelectionRows\"]"
        },
        {
          "name": "toggleAllSelection",
          "description": "切换当前页全选",
          "type": "TableInstance<T>[\"toggleAllSelection\"]"
        },
        {
          "name": "toggleRowSelection",
          "description": "切换单行选择状态；第三参数可显式决定是否忽略 selectable",
          "type": "TableInstance<T>[\"toggleRowSelection\"]"
        },
        {
          "name": "toggleRowExpansion",
          "description": "切换展开行状态",
          "type": "TableInstance<T>[\"toggleRowExpansion\"]"
        },
        {
          "name": "setCurrentRow",
          "description": "设置当前高亮行",
          "type": "TableInstance<T>[\"setCurrentRow\"]"
        },
        {
          "name": "clearSort",
          "description": "清空排序",
          "type": "TableInstance<T>[\"clearSort\"]"
        },
        {
          "name": "clearFilter",
          "description": "清空筛选",
          "type": "TableInstance<T>[\"clearFilter\"]"
        },
        {
          "name": "sort",
          "description": "主动设置排序",
          "type": "TableInstance<T>[\"sort\"]"
        },
        {
          "name": "doLayout",
          "description": "重新同步布局与滚动度量",
          "type": "TableInstance<T>[\"doLayout\"]"
        },
        {
          "name": "scrollTo",
          "description": "滚动到指定位置",
          "type": "TableInstance<T>[\"scrollTo\"]"
        },
        {
          "name": "setScrollTop",
          "description": "设置纵向滚动位置",
          "type": "TableInstance<T>[\"setScrollTop\"]"
        },
        {
          "name": "setScrollLeft",
          "description": "设置横向滚动位置",
          "type": "TableInstance<T>[\"setScrollLeft\"]"
        },
        {
          "name": "updateKeyChildren",
          "description": "在 lazy 模式下按 row-key 主动写回某个节点的子节点",
          "type": "TableInstance<T>[\"updateKeyChildren\"]"
        }
      ]
    },
    {
      "name": "pagination",
      "title": "Pagination 分页",
      "description": "列表页底部的分页切换组件。",
      "tags": [
        "xy-pagination"
      ],
      "exports": [
        "XyPagination"
      ],
      "layer": "base",
      "props": [
        {
          "name": "current-page",
          "description": "当前页码",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "default-current-page",
          "description": "非受控场景下的初始页码",
          "type": "number",
          "default": "1"
        },
        {
          "name": "page-size",
          "description": "每页条数",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "default-page-size",
          "description": "非受控场景下的初始每页条数",
          "type": "number",
          "default": "10"
        },
        {
          "name": "total",
          "description": "总条数",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "page-count",
          "description": "总页数，传入时优先级高于 total",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "pager-count",
          "description": "显示的页码按钮数量，超出后会折叠成省略号",
          "type": "number",
          "default": "7"
        },
        {
          "name": "layout",
          "description": "分页布局，支持 prev, pager, next, jumper, total, sizes, slot, ->",
          "type": "string",
          "default": "'prev, pager, next, jumper, ->, total'"
        },
        {
          "name": "page-sizes",
          "description": "可选每页条数",
          "type": "number[]",
          "default": "[10, 20, 30, 40, 50, 100]"
        },
        {
          "name": "prev-text",
          "description": "上一页按钮文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "next-text",
          "description": "下一页按钮文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "size",
          "description": "分页尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "跟随全局配置"
        },
        {
          "name": "small",
          "description": "是否启用紧凑尺寸，优先级高于 size",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "teleported",
          "description": "每页条数下拉是否挂到 body",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "append-size-to",
          "description": "每页条数下拉挂载目标",
          "type": "string | HTMLElement",
          "default": "'body'"
        },
        {
          "name": "popper-class",
          "description": "每页条数下拉自定义类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "popper-style",
          "description": "每页条数下拉自定义样式",
          "type": "string | CSSProperties | Array<string | CSSProperties>",
          "default": "undefined"
        },
        {
          "name": "disabled",
          "description": "是否禁用分页操作",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "background",
          "description": "是否启用带背景的按钮风格",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "hide-on-single-page",
          "description": "仅一页时是否隐藏",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "update:current-page",
          "description": "当前页变化时触发",
          "params": "PaginationPageHandler"
        },
        {
          "name": "update:page-size",
          "description": "每页条数变化时触发",
          "params": "PaginationPageHandler"
        },
        {
          "name": "current-change",
          "description": "当前页变化时触发",
          "params": "PaginationPageHandler"
        },
        {
          "name": "size-change",
          "description": "每页条数变化时触发",
          "params": "PaginationPageHandler"
        },
        {
          "name": "prev-click",
          "description": "点击上一页时触发",
          "params": "PaginationPageHandler"
        },
        {
          "name": "next-click",
          "description": "点击下一页时触发",
          "params": "PaginationPageHandler"
        },
        {
          "name": "change",
          "description": "页码或每页条数变化时统一触发",
          "params": "PaginationChangeHandler"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "当 layout 中包含 slot 时渲染自定义内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "charts",
      "title": "Charts 图表",
      "description": "基于 ECharts 的统一图表容器。",
      "tags": [
        "xy-charts"
      ],
      "exports": [
        "XyCharts"
      ],
      "layer": "base",
      "props": [
        {
          "name": "option",
          "description": "ECharts 配置对象",
          "type": "EChartsCoreOption",
          "default": "—"
        },
        {
          "name": "theme",
          "description": "图表主题名或主题对象",
          "type": "string | object",
          "default": "—"
        },
        {
          "name": "width",
          "description": "容器宽度",
          "type": "string | number",
          "default": "'100%'"
        },
        {
          "name": "height",
          "description": "容器高度",
          "type": "string | number",
          "default": "360"
        },
        {
          "name": "init-options",
          "description": "初始化参数，会在创建实例时传给 echarts.init",
          "type": "ChartsInitOptions",
          "default": "—"
        },
        {
          "name": "loading",
          "description": "是否显示加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loading-options",
          "description": "加载态配置",
          "type": "ChartsLoadingOptions",
          "default": "—"
        },
        {
          "name": "autoresize",
          "description": "是否自动监听容器尺寸变化并调用 resize",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "set-option-options",
          "description": "更新配置时传给 setOption 的第二个参数",
          "type": "ChartsSetOptionOptions",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "init",
          "description": "图表实例创建完成后触发",
          "params": "ChartsInstanceHandler"
        },
        {
          "name": "ready",
          "description": "图表实例可用后触发",
          "params": "ChartsInstanceHandler"
        },
        {
          "name": "click",
          "description": "图表元素点击时触发",
          "params": "ChartsClickHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "chart",
          "description": "当前图表实例引用",
          "type": "ChartsInstance[\"chart\"]"
        },
        {
          "name": "resize",
          "description": "手动触发图表重排",
          "type": "ChartsInstance[\"resize\"]"
        },
        {
          "name": "setOption",
          "description": "手动更新图表配置",
          "type": "ChartsInstance[\"setOption\"]"
        },
        {
          "name": "showLoading",
          "description": "手动显示加载态",
          "type": "ChartsInstance[\"showLoading\"]"
        },
        {
          "name": "hideLoading",
          "description": "手动隐藏加载态",
          "type": "ChartsInstance[\"hideLoading\"]"
        }
      ]
    },
    {
      "name": "editor",
      "title": "Editor 编辑器",
      "description": "基于 Vditor 的 Markdown 编辑器封装。",
      "tags": [
        "xy-editor"
      ],
      "exports": [
        "XyEditor"
      ],
      "layer": "base",
      "props": [
        {
          "name": "model-value",
          "description": "当前 Markdown 内容",
          "type": "EditorProps[\"modelValue\"]",
          "default": "''"
        },
        {
          "name": "options",
          "description": "透传给 Vditor 的配置项",
          "type": "EditorProps[\"options\"]",
          "default": "{}"
        },
        {
          "name": "placeholder",
          "description": "占位文案",
          "type": "EditorProps[\"placeholder\"]",
          "default": "''"
        },
        {
          "name": "height",
          "description": "编辑器高度",
          "type": "EditorProps[\"height\"]",
          "default": "'auto'"
        },
        {
          "name": "min-height",
          "description": "编辑器最小高度",
          "type": "string | number",
          "default": "360"
        },
        {
          "name": "disabled",
          "description": "是否禁用编辑",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "update:model-value",
          "description": "内容输入变化时触发",
          "params": "EditorModelValueChangeHandler"
        },
        {
          "name": "init",
          "description": "编辑器实例初始化后触发",
          "params": "EditorInstanceHandler"
        },
        {
          "name": "ready",
          "description": "编辑器实例可用后触发",
          "params": "EditorInstanceHandler"
        },
        {
          "name": "focus",
          "description": "获取焦点时触发",
          "params": "EditorFocusHandler"
        },
        {
          "name": "blur",
          "description": "失焦时触发",
          "params": "EditorBlurHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "editor",
          "description": "当前 Vditor 实例引用",
          "type": "EditorInstance[\"editor\"]"
        },
        {
          "name": "getValue",
          "description": "获取当前 Markdown 内容",
          "type": "EditorInstance[\"getValue\"]"
        },
        {
          "name": "setValue",
          "description": "主动写入 Markdown 内容",
          "type": "EditorInstance[\"setValue\"]"
        },
        {
          "name": "focus",
          "description": "让编辑器获取焦点",
          "type": "EditorInstance[\"focus\"]"
        }
      ]
    },
    {
      "name": "audio-player",
      "title": "AudioPlayer 音频播放器",
      "description": "基于 Howler 的音频播放封装。",
      "tags": [
        "xy-audio-player"
      ],
      "exports": [
        "XyAudioPlayer"
      ],
      "layer": "base",
      "props": [
        {
          "name": "src",
          "description": "音频源地址",
          "type": "AudioPlayerTrack[\"src\"]",
          "default": "—"
        },
        {
          "name": "track",
          "description": "带元信息的音轨对象，优先级高于 src / title / artist",
          "type": "AudioPlayerTrack",
          "default": "—"
        },
        {
          "name": "title",
          "description": "音频标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "artist",
          "description": "作者或来源说明",
          "type": "string",
          "default": "''"
        },
        {
          "name": "autoplay",
          "description": "是否自动播放",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "loop",
          "description": "是否循环播放",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "muted",
          "description": "是否静音",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "volume",
          "description": "当前音量，范围 0 ~ 1",
          "type": "number",
          "default": "1"
        },
        {
          "name": "playback-rates",
          "description": "倍速切换序列",
          "type": "number[]",
          "default": "[0.75, 1, 1.25, 1.5, 2]"
        }
      ],
      "events": [
        {
          "name": "init",
          "description": "音频实例初始化后触发",
          "params": "AudioPlayerHowlHandler"
        },
        {
          "name": "ready",
          "description": "音频加载完成后触发",
          "params": "AudioPlayerHowlHandler"
        },
        {
          "name": "play",
          "description": "开始播放时触发",
          "params": "AudioPlayerStateChangeHandler"
        },
        {
          "name": "pause",
          "description": "暂停播放时触发",
          "params": "AudioPlayerStateChangeHandler"
        },
        {
          "name": "end",
          "description": "播放结束时触发",
          "params": "AudioPlayerStateChangeHandler"
        },
        {
          "name": "update:volume",
          "description": "内部音量变化时触发",
          "params": "AudioPlayerVolumeUpdateHandler"
        },
        {
          "name": "time-update",
          "description": "播放进度更新时触发",
          "params": "AudioPlayerTimeUpdateHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "howl",
          "description": "当前 Howler 实例引用",
          "type": "AudioPlayerInstance[\"howl\"]"
        },
        {
          "name": "play",
          "description": "开始播放",
          "type": "AudioPlayerInstance[\"play\"]"
        },
        {
          "name": "pause",
          "description": "暂停播放",
          "type": "AudioPlayerInstance[\"pause\"]"
        },
        {
          "name": "stop",
          "description": "停止播放并回到起点",
          "type": "AudioPlayerInstance[\"stop\"]"
        },
        {
          "name": "seek",
          "description": "跳转到指定秒数",
          "type": "AudioPlayerInstance[\"seek\"]"
        },
        {
          "name": "setVolume",
          "description": "设置音量",
          "type": "AudioPlayerInstance[\"setVolume\"]"
        }
      ]
    },
    {
      "name": "video-player",
      "title": "VideoPlayer 视频播放器",
      "description": "基于 video.js 的视频播放封装。",
      "tags": [
        "xy-video-player"
      ],
      "exports": [
        "XyVideoPlayer"
      ],
      "layer": "base",
      "props": [
        {
          "name": "sources",
          "description": "视频源列表",
          "type": "VideoPlayerSource[]",
          "default": "[]"
        },
        {
          "name": "poster",
          "description": "封面图地址",
          "type": "string",
          "default": "''"
        },
        {
          "name": "autoplay",
          "description": "是否自动播放",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "controls",
          "description": "是否显示控制条",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "loop",
          "description": "是否循环播放",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "muted",
          "description": "是否静音",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "preload",
          "description": "预加载策略",
          "type": "VideoPlayerProps[\"preload\"]",
          "default": "'metadata'"
        },
        {
          "name": "width",
          "description": "容器宽度",
          "type": "string | number",
          "default": "'100%'"
        },
        {
          "name": "height",
          "description": "容器高度",
          "type": "string | number",
          "default": "360"
        },
        {
          "name": "options",
          "description": "透传给 video.js 的配置项",
          "type": "VideoPlayerProps[\"options\"]",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "init",
          "description": "播放器实例初始化后触发",
          "params": "VideoPlayerPlayerHandler"
        },
        {
          "name": "ready",
          "description": "播放器实例可用后触发",
          "params": "VideoPlayerPlayerHandler"
        },
        {
          "name": "play",
          "description": "开始播放时触发",
          "params": "VideoPlayerStateChangeHandler"
        },
        {
          "name": "pause",
          "description": "暂停播放时触发",
          "params": "VideoPlayerStateChangeHandler"
        },
        {
          "name": "ended",
          "description": "播放结束时触发",
          "params": "VideoPlayerStateChangeHandler"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "player",
          "description": "当前 video.js 实例引用",
          "type": "VideoPlayerInstance[\"player\"]"
        },
        {
          "name": "play",
          "description": "开始播放",
          "type": "VideoPlayerInstance[\"play\"]"
        },
        {
          "name": "pause",
          "description": "暂停播放",
          "type": "VideoPlayerInstance[\"pause\"]"
        },
        {
          "name": "load",
          "description": "加载指定片源列表",
          "type": "VideoPlayerInstance[\"load\"]"
        }
      ]
    },
    {
      "name": "search-form",
      "title": "SearchForm 搜索表单",
      "description": "统一筛选栏布局、折叠字段和查询动作的增强组件。",
      "tags": [
        "xy-search-form"
      ],
      "exports": [
        "XySearchForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "model",
          "description": "表单数据对象",
          "type": "Record<string, unknown>",
          "default": "—"
        },
        {
          "name": "fields",
          "description": "字段 schema 数组",
          "type": "SearchFormField[]",
          "default": "[]"
        },
        {
          "name": "rules",
          "description": "字段校验规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "columns",
          "description": "栅格列数",
          "type": "number",
          "default": "3"
        },
        {
          "name": "collapsed",
          "description": "是否折叠，受控模式",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "default-collapsed",
          "description": "默认是否折叠",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "submit-text",
          "description": "查询按钮文案",
          "type": "string",
          "default": "'查询'"
        },
        {
          "name": "reset-text",
          "description": "重置按钮文案",
          "type": "string",
          "default": "'重置'"
        },
        {
          "name": "submit-on-reset",
          "description": "重置后是否再次派发 search",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "validate-on-search",
          "description": "查询前是否校验字段",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "search",
          "description": "点击查询或触发主动提交时派发",
          "params": "(modelSnapshot) => void"
        },
        {
          "name": "reset",
          "description": "点击重置后派发",
          "params": "(modelSnapshot) => void"
        },
        {
          "name": "update:collapsed",
          "description": "折叠状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "collapse-change",
          "description": "折叠状态变化时派发",
          "params": "(value: boolean) => void"
        }
      ],
      "slots": [
        {
          "name": "meta",
          "description": "动作区左侧元信息",
          "props": ""
        },
        {
          "name": "actions",
          "description": "自定义动作区",
          "props": ""
        },
        {
          "name": "[field.slot / field.prop]",
          "description": "自定义字段内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "pro-form",
      "title": "ProForm 增强表单",
      "description": "统一标题、表单网格与动作区的增强表单容器。",
      "tags": [
        "xy-pro-form"
      ],
      "exports": [
        "XyProForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "表单标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "表单说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "model",
          "description": "表单数据对象",
          "type": "Record<string, unknown>",
          "default": "-"
        },
        {
          "name": "schema",
          "description": "schema 驱动的字段配置数组",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "rules",
          "description": "表单校验规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "label-width",
          "description": "表单项 label 宽度",
          "type": "string / number",
          "default": "'112px'"
        },
        {
          "name": "label-position",
          "description": "label 位置",
          "type": "'left' / 'top'",
          "default": "'top'"
        },
        {
          "name": "size",
          "description": "表单尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "'md'"
        },
        {
          "name": "columns",
          "description": "字段网格列数",
          "type": "number",
          "default": "2"
        },
        {
          "name": "loading",
          "description": "是否处于加载中，加载中不渲染表单体",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读，schema 非空时切换为只读详情展示",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly-descriptions-props",
          "description": "只读详情描述列表配置",
          "type": "Omit<DescriptionsProps, 'items' / 'title' / 'extra'>",
          "default": "{}"
        },
        {
          "name": "submitting",
          "description": "是否提交中，提交中禁用表单并让提交按钮进入 loading",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submit-text",
          "description": "提交按钮文案",
          "type": "string",
          "default": "'保存'"
        },
        {
          "name": "reset-text",
          "description": "重置按钮文案",
          "type": "string",
          "default": "'重置'"
        },
        {
          "name": "show-submit",
          "description": "是否显示提交按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "show-reset",
          "description": "是否显示重置按钮",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "submit",
          "description": "校验通过后派发，携带 model 深拷贝快照",
          "params": "(payload: Record<string, unknown>) => void"
        },
        {
          "name": "reset",
          "description": "重置表单后派发，携带 model 深拷贝快照",
          "params": "(payload: Record<string, unknown>) => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义表单项内容，仅在 schema 为空时渲染",
          "props": "{ model, readonly }"
        },
        {
          "name": "header",
          "description": "自定义头部区域，替换默认的标题和说明",
          "props": "-"
        },
        {
          "name": "meta",
          "description": "头部右侧补充信息区",
          "props": "-"
        },
        {
          "name": "[field.slot]",
          "description": "schema 字段的插槽名对应的自定义字段内容",
          "props": "{ field, model }"
        },
        {
          "name": "actions",
          "description": "自定义底部动作区按钮",
          "props": "{ model, submit, reset, submitting }"
        }
      ],
      "exposes": [
        {
          "name": "validate",
          "description": "触发内部表单校验，返回是否通过",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "submit",
          "description": "校验通过后派发 submit 事件，返回是否执行成功",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "reset",
          "description": "重置指定字段（缺省为全部）并派发 reset 事件",
          "type": "(prop?: string | string[] / string | string[][]) => void"
        },
        {
          "name": "clearValidate",
          "description": "清除指定字段的校验状态（缺省为全部）",
          "type": "(prop?: string | string[] / string | string[][]) => void"
        }
      ]
    },
    {
      "name": "overlay-form",
      "title": "OverlayForm 浮层表单",
      "description": "统一抽屉与弹窗表单的覆盖层编辑模型。",
      "tags": [
        "xy-overlay-form"
      ],
      "exports": [
        "XyOverlayForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "open",
          "description": "是否打开",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "container",
          "description": "覆盖层容器类型",
          "type": "'drawer' | 'modal'",
          "default": "'drawer'"
        },
        {
          "name": "mode",
          "description": "表单模式",
          "type": "'create' | 'edit' | 'view'",
          "default": "'create'"
        },
        {
          "name": "title",
          "description": "标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "model",
          "description": "表单数据",
          "type": "Record<string, unknown>",
          "default": "—"
        },
        {
          "name": "schema",
          "description": "字段 schema",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "rules",
          "description": "表单规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "loading",
          "description": "初始加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submitting",
          "description": "提交中态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "reset-on-close",
          "description": "关闭后是否重置字段与校验态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "destroy-on-close",
          "description": "关闭后是否卸载表单内容，下次打开重新挂载",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "drawer-props",
          "description": "透传给抽屉容器的属性",
          "type": "Partial<DrawerProps>",
          "default": "{}"
        },
        {
          "name": "dialog-props",
          "description": "透传给弹窗容器的属性",
          "type": "Partial<DialogProps>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:open",
          "description": "打开状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "submit",
          "description": "提交成功时派发",
          "params": "({ mode, model }) => void"
        },
        {
          "name": "cancel",
          "description": "取消时派发",
          "params": "({ mode, model }) => void"
        },
        {
          "name": "closed",
          "description": "覆盖层完全关闭后派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "表单内容",
          "props": ""
        },
        {
          "name": "actions",
          "description": "自定义底部动作区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "dialog-form",
      "title": "DialogForm 弹窗表单",
      "description": "基于 OverlayForm 的弹窗表单 facade。",
      "tags": [
        "xy-dialog-form"
      ],
      "exports": [
        "XyDialogForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "open",
          "description": "是否打开弹窗，受控模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "mode",
          "description": "表单模式，影响默认标题和按钮文案",
          "type": "'create' / 'edit' / 'view'",
          "default": "'create'"
        },
        {
          "name": "title",
          "description": "弹窗标题，缺省时按 mode 生成",
          "type": "string",
          "default": "''"
        },
        {
          "name": "model",
          "description": "表单数据对象",
          "type": "Record<string, unknown>",
          "default": "-"
        },
        {
          "name": "schema",
          "description": "schema 驱动的字段配置数组",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "rules",
          "description": "表单校验规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "label-width",
          "description": "表单项 label 宽度",
          "type": "string / number",
          "default": "'112px'"
        },
        {
          "name": "label-position",
          "description": "label 位置",
          "type": "'left' / 'top'",
          "default": "'top'"
        },
        {
          "name": "size",
          "description": "表单尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "'md'"
        },
        {
          "name": "loading",
          "description": "是否处于加载中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submitting",
          "description": "是否提交中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读，mode 为 view 时强制只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submit-text",
          "description": "提交按钮文案，缺省时按 mode 生成",
          "type": "string",
          "default": "''"
        },
        {
          "name": "cancel-text",
          "description": "取消按钮文案，缺省时按 mode 生成",
          "type": "string",
          "default": "''"
        },
        {
          "name": "reset-on-close",
          "description": "关闭时是否重置表单状态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "destroy-on-close",
          "description": "关闭后是否销毁表单内容",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "dialog-props",
          "description": "透传给内部 xy-dialog 的配置",
          "type": "Omit<Partial<DialogProps>, 'modelValue' / 'title'>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:open",
          "description": "弹窗开合状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "submit",
          "description": "校验通过后派发，携带模式与 model 快照",
          "params": "(payload: OverlayFormSubmitPayload) => void"
        },
        {
          "name": "cancel",
          "description": "点击取消按钮时派发并关闭弹窗",
          "params": "(payload: OverlayFormSubmitPayload) => void"
        },
        {
          "name": "closed",
          "description": "弹窗关闭动画结束后派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义表单项内容，仅在 schema 为空时渲染",
          "props": "{ model, mode, readonly }"
        },
        {
          "name": "actions",
          "description": "自定义底部动作区按钮",
          "props": "{ model, mode, readonly, submitting, submit, cancel, close }"
        }
      ],
      "exposes": [
        {
          "name": "validate",
          "description": "触发内部表单校验，返回是否通过",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "submit",
          "description": "校验通过后派发 submit 事件，返回是否执行成功",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "close",
          "description": "关闭弹窗",
          "type": "() => void"
        }
      ]
    },
    {
      "name": "drawer-form",
      "title": "DrawerForm 抽屉表单",
      "description": "基于 OverlayForm 的抽屉表单 facade。",
      "tags": [
        "xy-drawer-form"
      ],
      "exports": [
        "XyDrawerForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "open",
          "description": "是否打开抽屉，受控模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "mode",
          "description": "表单模式，影响默认标题和按钮文案",
          "type": "'create' / 'edit' / 'view'",
          "default": "'create'"
        },
        {
          "name": "title",
          "description": "抽屉标题，缺省时按 mode 生成",
          "type": "string",
          "default": "''"
        },
        {
          "name": "model",
          "description": "表单数据对象",
          "type": "Record<string, unknown>",
          "default": "-"
        },
        {
          "name": "schema",
          "description": "schema 驱动的字段配置数组",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "rules",
          "description": "表单校验规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "label-width",
          "description": "表单项 label 宽度",
          "type": "string / number",
          "default": "'112px'"
        },
        {
          "name": "label-position",
          "description": "label 位置",
          "type": "'left' / 'top'",
          "default": "'top'"
        },
        {
          "name": "size",
          "description": "表单尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "'md'"
        },
        {
          "name": "loading",
          "description": "是否处于加载中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submitting",
          "description": "是否提交中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读，mode 为 view 时强制只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submit-text",
          "description": "提交按钮文案，缺省时按 mode 生成",
          "type": "string",
          "default": "''"
        },
        {
          "name": "cancel-text",
          "description": "取消按钮文案，缺省时按 mode 生成",
          "type": "string",
          "default": "''"
        },
        {
          "name": "reset-on-close",
          "description": "关闭时是否重置表单状态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "destroy-on-close",
          "description": "关闭后是否销毁表单内容",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "drawer-props",
          "description": "透传给内部 xy-drawer 的配置",
          "type": "Omit<Partial<DrawerProps>, 'modelValue' / 'title'>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:open",
          "description": "抽屉开合状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "submit",
          "description": "校验通过后派发，携带模式与 model 快照",
          "params": "(payload: OverlayFormSubmitPayload) => void"
        },
        {
          "name": "cancel",
          "description": "点击取消按钮时派发并关闭抽屉",
          "params": "(payload: OverlayFormSubmitPayload) => void"
        },
        {
          "name": "closed",
          "description": "抽屉关闭动画结束后派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义表单项内容，仅在 schema 为空时渲染",
          "props": "{ model, mode, readonly }"
        },
        {
          "name": "actions",
          "description": "自定义底部动作区按钮",
          "props": "{ model, mode, readonly, submitting, submit, cancel, close }"
        }
      ],
      "exposes": [
        {
          "name": "validate",
          "description": "触发内部表单校验，返回是否通过",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "submit",
          "description": "校验通过后派发 submit 事件，返回是否执行成功",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "close",
          "description": "关闭抽屉",
          "type": "() => void"
        }
      ]
    },
    {
      "name": "steps-form",
      "title": "StepsForm 分步表单",
      "description": "用统一步骤条和表单动作承接分阶段录入流程。",
      "tags": [
        "xy-steps-form"
      ],
      "exports": [
        "XyStepsForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "model",
          "description": "表单数据对象，所有步骤共享",
          "type": "Record<string, unknown>",
          "default": "-"
        },
        {
          "name": "steps",
          "description": "步骤配置数组",
          "type": "StepsFormStep[]",
          "default": "[]"
        },
        {
          "name": "placement",
          "description": "承载容器",
          "type": "'page' / 'drawer'",
          "default": "'page'"
        },
        {
          "name": "open",
          "description": "抽屉模式下是否打开，受控模式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "title",
          "description": "标题，缺省时为「分步表单」",
          "type": "string",
          "default": "''"
        },
        {
          "name": "active",
          "description": "当前步骤索引，受控模式",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "default-active",
          "description": "默认步骤索引，非受控模式使用",
          "type": "number",
          "default": "0"
        },
        {
          "name": "loading",
          "description": "是否处于加载中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly",
          "description": "是否只读，只读时复用只读详情展示协议",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "readonly-descriptions-props",
          "description": "只读详情描述列表配置",
          "type": "Omit<DescriptionsProps, 'items' / 'title' / 'extra'>",
          "default": "{}"
        },
        {
          "name": "submitting",
          "description": "是否提交中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "next-text",
          "description": "下一步按钮文案",
          "type": "string",
          "default": "'下一步'"
        },
        {
          "name": "prev-text",
          "description": "上一步按钮文案",
          "type": "string",
          "default": "'上一步'"
        },
        {
          "name": "submit-text",
          "description": "提交按钮文案",
          "type": "string",
          "default": "'提交'"
        },
        {
          "name": "drawer-props",
          "description": "透传给内部 xy-drawer 的配置",
          "type": "Omit<Partial<DrawerProps>, 'modelValue' / 'title'>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:active",
          "description": "步骤索引变化时派发",
          "params": "(value: number) => void"
        },
        {
          "name": "update:open",
          "description": "抽屉开合状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "step-change",
          "description": "步骤切换后派发",
          "params": "(value: number) => void"
        },
        {
          "name": "next",
          "description": "进入下一步成功后派发，携带新索引",
          "params": "(value: number) => void"
        },
        {
          "name": "prev",
          "description": "返回上一步成功后派发，携带新索引",
          "params": "(value: number) => void"
        },
        {
          "name": "submit",
          "description": "最后一步校验通过后派发，携带 model 深拷贝快照",
          "params": "(payload: Record<string, unknown>) => void"
        },
        {
          "name": "cancel",
          "description": "点击抽屉底部关闭按钮时派发并关闭抽屉",
          "params": "() => void"
        },
        {
          "name": "closed",
          "description": "抽屉关闭动画结束后派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义当前步骤表单内容",
          "props": "{ step, active }"
        },
        {
          "name": "footer",
          "description": "自定义抽屉底部动作区，仅 placement=\"drawer\" 时可用",
          "props": "-"
        }
      ],
      "exposes": [
        {
          "name": "next",
          "description": "校验当前步骤后进入下一步，最后一步无效",
          "type": "() => Promise<void>"
        },
        {
          "name": "prev",
          "description": "返回上一步，第一步无效",
          "type": "() => Promise<void>"
        },
        {
          "name": "submit",
          "description": "校验后派发 submit 事件",
          "type": "() => Promise<void>"
        },
        {
          "name": "close",
          "description": "关闭抽屉，触发 update:open 为 false",
          "type": "() => void"
        }
      ]
    },
    {
      "name": "filter-panel",
      "title": "FilterPanel 筛选面板",
      "description": "把筛选区头部、折叠和动作区收成统一卡片。",
      "tags": [
        "xy-filter-panel"
      ],
      "exports": [
        "XyFilterPanel"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "面板标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "面板说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "collapsed",
          "description": "是否折叠，受控模式",
          "type": "boolean",
          "default": "undefined"
        },
        {
          "name": "default-collapsed",
          "description": "默认是否折叠，非受控模式使用",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "collapsible",
          "description": "是否显示折叠切换按钮",
          "type": "boolean",
          "default": "true"
        }
      ],
      "events": [
        {
          "name": "update:collapsed",
          "description": "折叠状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "toggle",
          "description": "折叠状态切换后派发",
          "params": "(value: boolean) => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "筛选项内容，折叠时隐藏",
          "props": "-"
        },
        {
          "name": "meta",
          "description": "头部右侧补充内容，位于折叠按钮之前",
          "props": "-"
        },
        {
          "name": "actions",
          "description": "底部动作区，仅在提供了内容时渲染",
          "props": "-"
        }
      ],
      "exposes": []
    },
    {
      "name": "request-form",
      "title": "RequestForm 请求表单",
      "description": "统一首屏加载、提交请求与表单容器的增强组件。",
      "tags": [
        "xy-request-form"
      ],
      "exports": [
        "XyRequestForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "表单标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "表单说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "model",
          "description": "表单数据对象，初始请求结果会合并回该对象",
          "type": "Record<string, unknown>",
          "default": "-"
        },
        {
          "name": "schema",
          "description": "schema 驱动的字段配置数组",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "rules",
          "description": "表单校验规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "label-width",
          "description": "表单项 label 宽度",
          "type": "string / number",
          "default": "'112px'"
        },
        {
          "name": "label-position",
          "description": "label 位置",
          "type": "'left' / 'top'",
          "default": "'top'"
        },
        {
          "name": "size",
          "description": "表单尺寸",
          "type": "('sm' | 'md' | 'lg')",
          "default": "'md'"
        },
        {
          "name": "readonly",
          "description": "是否只读",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "immediate",
          "description": "挂载后是否立即执行 initial-request",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "initial-request",
          "description": "初始加载请求，未提供时直接使用 model 当前值作为初始快照",
          "type": "(ctx: ProRequestContext) => Promise<Record<string, unknown>>",
          "default": "undefined"
        },
        {
          "name": "submit-request",
          "description": "提交请求，未提供时校验通过即视为提交成功",
          "type": "(ctx: RequestFormSubmitContext) => Promise<unknown>",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "request-success",
          "description": "初始加载成功时派发，携带请求结果",
          "params": "(payload: Record<string, unknown>) => void"
        },
        {
          "name": "request-error",
          "description": "初始加载失败时派发",
          "params": "(error: unknown) => void"
        },
        {
          "name": "submit-success",
          "description": "提交请求成功时派发，携带请求结果",
          "params": "(payload: unknown) => void"
        },
        {
          "name": "submit-error",
          "description": "提交请求失败时派发",
          "params": "(error: unknown) => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义表单项内容，透传给内部 xy-pro-form",
          "props": "{ model }"
        }
      ],
      "exposes": [
        {
          "name": "reload",
          "description": "重新执行初始加载请求",
          "type": "() => Promise<void>"
        },
        {
          "name": "refresh",
          "description": "刷新初始数据",
          "type": "() => Promise<void>"
        },
        {
          "name": "reset",
          "description": "将 model 回填为初始快照并重新加载",
          "type": "() => Promise<void>"
        },
        {
          "name": "submit",
          "description": "校验通过后执行提交请求，返回是否成功",
          "type": "() => Promise<boolean>"
        }
      ]
    },
    {
      "name": "login-form",
      "title": "LoginForm 登录表单",
      "description": "面向认证场景的登录主链路组件。",
      "tags": [
        "xy-login-form"
      ],
      "exports": [
        "XyLoginForm"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "model",
          "description": "登录表单数据",
          "type": "LoginFormModel",
          "default": "—"
        },
        {
          "name": "title",
          "description": "登录标题",
          "type": "string",
          "default": "'欢迎登录'"
        },
        {
          "name": "description",
          "description": "登录说明",
          "type": "string",
          "default": "'请输入账号信息后继续访问控制台。'"
        },
        {
          "name": "loading",
          "description": "提交中的加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "disabled",
          "description": "是否禁用表单",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "submit-text",
          "description": "提交按钮文案",
          "type": "string",
          "default": "'登录'"
        },
        {
          "name": "show-remember",
          "description": "是否显示记住我",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "remember-label",
          "description": "记住我文案",
          "type": "string",
          "default": "'记住我'"
        },
        {
          "name": "username-placeholder",
          "description": "用户名占位文案",
          "type": "string",
          "default": "'请输入用户名'"
        },
        {
          "name": "password-placeholder",
          "description": "密码占位文案",
          "type": "string",
          "default": "'请输入密码'"
        },
        {
          "name": "rules",
          "description": "自定义校验规则，用于覆盖默认用户名/密码必填规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "third-party-items",
          "description": "第三方登录入口列表",
          "type": "LoginFormThirdPartyItem[]",
          "default": "[]"
        }
      ],
      "events": [
        {
          "name": "submit",
          "description": "校验通过并提交时触发",
          "params": "(model: LoginFormModel) => void"
        },
        {
          "name": "third-party-click",
          "description": "点击第三方登录入口时触发",
          "params": "(item: LoginFormThirdPartyItem) => void"
        }
      ],
      "slots": [],
      "exposes": [
        {
          "name": "validate",
          "description": "手动触发表单校验",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "submit",
          "description": "手动提交登录表单",
          "type": "() => Promise<boolean>"
        },
        {
          "name": "focus",
          "description": "聚焦到指定输入框",
          "type": "(field?: 'username' | 'password') => void"
        }
      ]
    },
    {
      "name": "page-toolbar",
      "title": "PageToolbar 页面工具栏",
      "description": "页面级标题、动作区和扩展内容容器。",
      "tags": [
        "xy-page-toolbar"
      ],
      "exports": [
        "XyPageToolbar"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "工具栏标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "工具栏说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "divider",
          "description": "内容区与头部之间是否显示分隔线",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "sticky",
          "description": "是否吸顶",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "offset-top",
          "description": "吸顶时的顶部偏移量，仅 sticky 时生效",
          "type": "number",
          "default": "0"
        },
        {
          "name": "bordered",
          "description": "是否启用卡片化边框预设：整圈边框、容器底色与投影",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "style",
          "description": "自定义根节点样式",
          "type": "CSSProperties",
          "default": "undefined"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "title",
          "description": "自定义标题区，替换默认的 title 渲染",
          "props": "-"
        },
        {
          "name": "actions",
          "description": "右侧动作区，仅在提供了内容时渲染",
          "props": "-"
        },
        {
          "name": "default",
          "description": "工具栏下方的扩展内容，仅在提供了内容时渲染",
          "props": "-"
        }
      ],
      "exposes": []
    },
    {
      "name": "page-header",
      "title": "PageHeader 页面头部",
      "description": "页面级标题、描述、元信息与动作区容器。",
      "tags": [
        "xy-page-header"
      ],
      "exports": [
        "XyPageHeader"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "页面标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "页面说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "meta-items",
          "description": "头部辅助信息列表",
          "type": "PageMetaItem[]",
          "default": "[]"
        },
        {
          "name": "divider",
          "description": "是否在头部底部显示分隔线",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "bordered",
          "description": "是否显示边框容器样式",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "title",
          "description": "自定义标题区域",
          "props": ""
        },
        {
          "name": "actions",
          "description": "右侧动作区",
          "props": ""
        },
        {
          "name": "meta",
          "description": "自定义元信息区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "page-container",
      "title": "PageContainer 页面容器",
      "description": "页面头部、主体内容与底部区的统一承载容器。",
      "tags": [
        "xy-page-container"
      ],
      "exports": [
        "XyPageContainer"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "页面标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "页面说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "meta-items",
          "description": "页面元信息列表",
          "type": "PageMetaItem[]",
          "default": "[]"
        },
        {
          "name": "divider",
          "description": "默认头部是否显示分隔线",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "bordered",
          "description": "是否显示边框容器样式",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "loading",
          "description": "是否显示统一 loading 视觉",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "shadow",
          "description": "是否显示阴影容器样式",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "body-class",
          "description": "body 区额外类名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "body-style",
          "description": "body 区内联样式",
          "type": "CSSProperties",
          "default": "—"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "header",
          "description": "自定义头部，提供后完全覆盖默认头部",
          "props": ""
        },
        {
          "name": "actions",
          "description": "默认头部右侧动作区",
          "props": ""
        },
        {
          "name": "extra",
          "description": "默认头部右侧扩展区，未提供 actions 时作为兜底动作区",
          "props": ""
        },
        {
          "name": "meta",
          "description": "默认头部元信息区",
          "props": ""
        },
        {
          "name": "default",
          "description": "页面主体内容",
          "props": ""
        },
        {
          "name": "footer",
          "description": "页面底部区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "avatar-menu",
      "title": "AvatarMenu 头像菜单",
      "description": "用户头像与下拉菜单组合组件。",
      "tags": [
        "xy-avatar-menu"
      ],
      "exports": [
        "XyAvatarMenu"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "username",
          "description": "用户名，显示在头像右侧的加粗文字",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "用户名下方的描述文字",
          "type": "string",
          "default": "''"
        },
        {
          "name": "items",
          "description": "下拉菜单项数组，即 DropdownItem 的别名 AvatarMenuItem",
          "type": "AvatarMenuItem[]",
          "default": "[]"
        },
        {
          "name": "dropdown-props",
          "description": "透传给 xy-dropdown 的 props，触发方式默认为 click，可经此属性覆盖",
          "type": "Partial<DropdownProps>",
          "default": "{}"
        },
        {
          "name": "avatar-props",
          "description": "透传给 xy-avatar 的 props",
          "type": "Partial<AvatarProps>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "command",
          "description": "点击下拉菜单命令项时派发",
          "params": "(command: AvatarMenuCommand) => void，AvatarMenuCommand 即 DropdownCommand | string | undefined"
        },
        {
          "name": "select",
          "description": "选中下拉菜单项时派发",
          "params": "(item: DropdownSelectItem) => void"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "pro-table",
      "title": "ProTable 增强表格",
      "description": "统一工具栏、搜索区、表格主干和分页联动的增强组件。",
      "tags": [
        "xy-pro-table"
      ],
      "exports": [
        "XyProTable"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "工具栏标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "工具栏说明",
          "type": "string",
          "default": "''"
        },
        {
          "name": "data",
          "description": "表格数据",
          "type": "T[]",
          "default": "[]"
        },
        {
          "name": "columns",
          "description": "列 schema 数组",
          "type": "ProTableColumn<T>[]",
          "default": "[]"
        },
        {
          "name": "loading",
          "description": "是否加载中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "toolbar-actions",
          "description": "工具栏按钮组",
          "type": "Array<{ key: string; label: string; type?: ('default' | 'primary' | 'success' | 'warning' | 'danger'); ... }>",
          "default": "[]"
        },
        {
          "name": "table-props",
          "description": "透传给 xy-table 的 props",
          "type": "Partial<TableProps<T>>",
          "default": "{}"
        },
        {
          "name": "workbench",
          "description": "工作台配置，控制刷新、密度、列设置、全屏、筛选、导出、打印",
          "type": "ProTableWorkbenchConfig",
          "default": "{}"
        },
        {
          "name": "request",
          "description": "远程请求配置",
          "type": "ProTableRequestConfig<T>",
          "default": "undefined"
        },
        {
          "name": "views",
          "description": "搜索区、筛选抽屉和保存视图配置",
          "type": "ProTableViewsConfig",
          "default": "undefined"
        },
        {
          "name": "batch-actions",
          "description": "批量动作按钮组",
          "type": "ProTableBatchAction[]",
          "default": "[]"
        },
        {
          "name": "table-select",
          "description": "表格选择器模式配置",
          "type": "ProTableTableSelectConfig",
          "default": "undefined"
        },
        {
          "name": "editable",
          "description": "编辑模式配置",
          "type": "ProTableEditableConfig<T>",
          "default": "undefined"
        },
        {
          "name": "virtual",
          "description": "虚拟列表配置",
          "type": "ProTableVirtualConfig",
          "default": "undefined"
        },
        {
          "name": "contextmenu",
          "description": "右键菜单配置",
          "type": "ProTableContextmenuConfig<T>",
          "default": "undefined"
        },
        {
          "name": "export-options",
          "description": "导出配置",
          "type": "ProTableExportOptions<T>",
          "default": "undefined"
        },
        {
          "name": "print-options",
          "description": "打印配置",
          "type": "ProTablePrintOptions<T>",
          "default": "undefined"
        },
        {
          "name": "pagination",
          "description": "是否显示分页区",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "current-page",
          "description": "当前页，受控模式",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "page-size",
          "description": "当前每页条数，受控模式",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "default-current-page",
          "description": "默认页码",
          "type": "number",
          "default": "1"
        },
        {
          "name": "default-page-size",
          "description": "默认每页条数",
          "type": "number",
          "default": "10"
        },
        {
          "name": "total",
          "description": "总条数",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "page-sizes",
          "description": "可选每页条数",
          "type": "number[]",
          "default": "[10, 20, 50, 100]"
        }
      ],
      "events": [
        {
          "name": "toolbar-action",
          "description": "点击工具栏按钮时派发",
          "params": "(action) => void"
        },
        {
          "name": "workbench-action",
          "description": "点击内置工作台动作时派发",
          "params": "(actionKey) => void"
        },
        {
          "name": "update:currentPage",
          "description": "当前页变化时派发",
          "params": "(page: number) => void"
        },
        {
          "name": "update:pageSize",
          "description": "每页条数变化时派发",
          "params": "(pageSize: number) => void"
        },
        {
          "name": "page-change",
          "description": "分页任一维度变化时派发",
          "params": "(page, pageSize) => void"
        },
        {
          "name": "request-success",
          "description": "远程请求成功时派发",
          "params": "(rows) => void"
        },
        {
          "name": "request-error",
          "description": "远程请求失败时派发",
          "params": "(error) => void"
        },
        {
          "name": "batch-action",
          "description": "点击批量动作时派发",
          "params": "(action, selection) => void"
        },
        {
          "name": "view-select",
          "description": "选中保存视图时派发",
          "params": "(item) => void"
        },
        {
          "name": "filter-apply",
          "description": "应用筛选抽屉时派发",
          "params": "(model) => void"
        },
        {
          "name": "contextmenu-select",
          "description": "点击右键菜单项时派发",
          "params": "(item, payload) => void"
        },
        {
          "name": "table-select-confirm",
          "description": "确认表格选择器结果时派发",
          "params": "(selection) => void"
        },
        {
          "name": "edit-submit",
          "description": "保存编辑内容时派发",
          "params": "({ rows }) => void"
        },
        {
          "name": "row-click",
          "description": "透传自 xy-table",
          "params": "(row, rowIndex, event) => void"
        },
        {
          "name": "selection-change",
          "description": "透传自 xy-table",
          "params": "(selection) => void"
        },
        {
          "name": "sort-change",
          "description": "透传自 xy-table",
          "params": "({ column, prop, order }) => void"
        },
        {
          "name": "filter-change",
          "description": "透传自 xy-table",
          "params": "(filterValues) => void"
        }
      ],
      "slots": [
        {
          "name": "toolbar-main",
          "description": "自定义标题区",
          "props": ""
        },
        {
          "name": "toolbar-left",
          "description": "工具栏右侧操作区前置内容",
          "props": ""
        },
        {
          "name": "toolbar-right",
          "description": "工具栏右侧操作区尾部内容",
          "props": ""
        },
        {
          "name": "search",
          "description": "搜索区内容",
          "props": ""
        },
        {
          "name": "footer-meta",
          "description": "分页左侧补充信息",
          "props": ""
        },
        {
          "name": "loading",
          "description": "自定义加载态",
          "props": ""
        },
        {
          "name": "empty",
          "description": "自定义空态",
          "props": ""
        },
        {
          "name": "[column.slot / column.prop]",
          "description": "自定义单元格内容",
          "props": ""
        },
        {
          "name": "[column.headerSlot]",
          "description": "自定义表头内容",
          "props": ""
        },
        {
          "name": "[column.editorSlot]",
          "description": "自定义编辑态内容",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "header-tabs",
      "title": "HeaderTabs 头部页签",
      "description": "工作台头部页签与批量操作菜单。",
      "tags": [
        "xy-header-tabs"
      ],
      "exports": [
        "XyHeaderTabs"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "model-value",
          "description": "当前激活页签 key，受控模式",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "default-value",
          "description": "默认激活页签 key，非受控模式",
          "type": "string",
          "default": "undefined"
        },
        {
          "name": "items",
          "description": "页签数据，HeaderTabItem 继承自 TabItem 并扩展 badge?: string | number（类型上预留 badge? 字段，当前版本暂未渲染徽标）",
          "type": "HeaderTabItem[]",
          "default": "[]"
        },
        {
          "name": "type",
          "description": "页签风格",
          "type": "TabsType（'' | 'card' | 'border-card'）",
          "default": "'card'"
        },
        {
          "name": "tab-position",
          "description": "页签位置",
          "type": "TabsPosition（'top' | 'right' | 'bottom' | 'left'）",
          "default": "'top'"
        },
        {
          "name": "closable",
          "description": "是否显示页签关闭按钮",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "addable",
          "description": "是否允许新增页签",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "editable",
          "description": "是否编辑模式（同时开启新增和关闭）",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "before-leave",
          "description": "切换页签前的拦截钩子",
          "type": "TabsBeforeLeave",
          "default": "undefined"
        },
        {
          "name": "menu-actions",
          "description": "右侧批量操作菜单项",
          "type": "Array<{ key: HeaderTabsMenuAction; label: string }>",
          "default": "内置五个关闭动作：关闭当前、关闭其他、关闭左侧、关闭右侧、关闭全部"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "description": "激活页签变化时派发",
          "params": "(value: string) => void"
        },
        {
          "name": "change",
          "description": "激活页签变化时派发",
          "params": "(value: string) => void"
        },
        {
          "name": "edit",
          "description": "页签新增或关闭时派发",
          "params": "(key: string | undefined, action: 'remove' | 'add') => void"
        },
        {
          "name": "tabRemove",
          "description": "关闭页签时派发",
          "params": "(key: string) => void"
        },
        {
          "name": "tabAdd",
          "description": "点击新增页签时派发",
          "params": "() => void"
        },
        {
          "name": "tabMenuClick",
          "description": "点击右侧菜单动作时派发",
          "params": "(action: HeaderTabsMenuAction) => void，HeaderTabsMenuAction 即 'close-current' | 'close-others' | 'close-left' | 'close-right' | 'close-all'"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "notice-center",
      "title": "NoticeCenter 站内消息中心",
      "description": "站内消息 tabs、消息项和底部动作区。",
      "tags": [
        "xy-notice-center"
      ],
      "exports": [
        "XyNoticeCenter"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "tabs",
          "description": "消息分组页签数据，每项含 key / label / items，items 为该组消息列表",
          "type": "NoticeCenterTab[]",
          "default": "[]"
        },
        {
          "name": "actions",
          "description": "底部动作按钮配置，每项含 key / label / icon?",
          "type": "NoticeCenterAction[]",
          "default": "[]"
        },
        {
          "name": "max-height",
          "description": "消息列表区最大高度，数字按 px 处理",
          "type": "string | number",
          "default": "360"
        },
        {
          "name": "empty-text",
          "description": "分组下无消息时的空态文案",
          "type": "string",
          "default": "'暂无消息'"
        },
        {
          "name": "default-tab",
          "description": "默认激活的页签 key，不传时取第一个分组",
          "type": "string",
          "default": "''"
        }
      ],
      "events": [
        {
          "name": "tabChange",
          "description": "切换消息分组时派发",
          "params": "(value: string) => void"
        },
        {
          "name": "itemClick",
          "description": "点击单条消息时派发",
          "params": "(tabKey: string, itemKey: string) => void"
        },
        {
          "name": "actionClick",
          "description": "点击底部动作按钮时派发",
          "params": "(action: NoticeCenterAction) => void"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "stat-card",
      "title": "StatCard 指标卡片",
      "description": "承接数字指标、说明、趋势和加载态的轻量卡片。",
      "tags": [
        "xy-stat-card"
      ],
      "exports": [
        "XyStatCard"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "指标标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "value",
          "description": "指标值",
          "type": "string | number",
          "default": "''"
        },
        {
          "name": "description",
          "description": "辅助说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "icon",
          "description": "指标图标名",
          "type": "string",
          "default": "''"
        },
        {
          "name": "trend",
          "description": "趋势类型，仅影响趋势区图标与强调色",
          "type": "'up' | 'down' | 'flat'",
          "default": "'flat'"
        },
        {
          "name": "trend-text",
          "description": "趋势说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "loading",
          "description": "是否显示骨架占位",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [],
      "slots": [],
      "exposes": []
    },
    {
      "name": "column-setting-panel",
      "title": "ColumnSettingPanel 列设置面板",
      "description": "统一列表列显隐选择和重置入口的增强面板。",
      "tags": [
        "xy-column-setting-panel"
      ],
      "exports": [
        "XyColumnSettingPanel"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "面板标题",
          "type": "string",
          "default": "'列设置'"
        },
        {
          "name": "description",
          "description": "标题下方的补充说明，为空时不渲染",
          "type": "string",
          "default": "''"
        },
        {
          "name": "columns",
          "description": "列配置项，每项含 key / label，可选 description 和 disabled",
          "type": "ColumnSettingPanelColumn[]",
          "default": "[]"
        },
        {
          "name": "model-value",
          "description": "当前勾选的列 key 集合，支持 v-model",
          "type": "string[]",
          "default": "[]"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "description": "勾选集合变化时派发（勾选或全选）",
          "params": "(value: string[]) => void"
        },
        {
          "name": "change",
          "description": "勾选集合变化时派发",
          "params": "(value: string[]) => void"
        },
        {
          "name": "reset",
          "description": "点击「重置」时派发，重置结果为未被 disabled 的全部列",
          "params": "(value: string[]) => void"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "saved-view-tabs",
      "title": "SavedViewTabs 视图页签",
      "description": "把常用列表视图和快捷切换收成页签结构。",
      "tags": [
        "xy-saved-view-tabs"
      ],
      "exports": [
        "XySavedViewTabs"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "items",
          "description": "视图页签数据，每项含 key / label，可选 count（展示为 label (count)）和 closable",
          "type": "SavedViewTabItem[]",
          "default": "[]"
        },
        {
          "name": "active-key",
          "description": "当前激活页签 key，支持 v-model:active-key",
          "type": "string",
          "default": "''"
        },
        {
          "name": "addable",
          "description": "是否显示新增页签入口",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [
        {
          "name": "update:activeKey",
          "description": "激活页签变化时派发",
          "params": "(value: string) => void"
        },
        {
          "name": "select",
          "description": "选中某个视图页签时派发",
          "params": "(item: SavedViewTabItem) => void"
        },
        {
          "name": "remove",
          "description": "关闭某个视图页签时派发",
          "params": "(item: SavedViewTabItem) => void"
        },
        {
          "name": "create",
          "description": "点击新增页签入口时派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "页签内容区，原样透传给内部 xy-tabs 的默认插槽",
          "props": "-"
        }
      ],
      "exposes": []
    },
    {
      "name": "table-filter-drawer",
      "title": "TableFilterDrawer 表格筛选抽屉",
      "description": "用抽屉承接列表的高级筛选项和应用重置动作。",
      "tags": [
        "xy-table-filter-drawer"
      ],
      "exports": [
        "XyTableFilterDrawer"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "open",
          "description": "是否打开抽屉，支持 v-model:open",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "title",
          "description": "抽屉标题",
          "type": "string",
          "default": "'筛选条件'"
        },
        {
          "name": "model",
          "description": "筛选表单数据对象，必填，字段名需与 fields 的 prop 对应",
          "type": "Record<string, unknown>",
          "default": "-"
        },
        {
          "name": "fields",
          "description": "筛选字段 schema，内部交给 XyProForm 渲染，继承 ProFieldSchema 的能力",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "drawer-props",
          "description": "透传给 xy-drawer 的 props，继承自 DrawerProps（Omit 掉 modelValue / title）的关键属性，如 size（默认 420）、placement、closeOnOverlay、destroyOnClose、beforeClose 等",
          "type": "Omit<Partial<DrawerProps>, 'modelValue' | 'title'>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:open",
          "description": "抽屉开关状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "apply",
          "description": "点击「应用筛选」时派发，携带当前 model 的浅拷贝，随后自动关闭抽屉",
          "params": "(payload: Record<string, unknown>) => void"
        },
        {
          "name": "reset",
          "description": "点击「重置」时派发，携带当前 model 的浅拷贝，随后自动关闭抽屉",
          "params": "(payload: Record<string, unknown>) => void"
        },
        {
          "name": "closed",
          "description": "抽屉关闭动画结束后派发",
          "params": "() => void"
        }
      ],
      "slots": [],
      "exposes": []
    },
    {
      "name": "import-result-table",
      "title": "ImportResultTable 导入结果表格",
      "description": "用统一摘要区和表格结果承接导入反馈。",
      "tags": [
        "xy-import-result-table"
      ],
      "exports": [
        "XyImportResultTable"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "data",
          "description": "导入结果数据行",
          "type": "T[]",
          "default": "[]"
        },
        {
          "name": "columns",
          "description": "表格列 schema，直接复用 ProTableColumn<T>",
          "type": "ProTableColumn<T>[]",
          "default": "[]"
        },
        {
          "name": "summary",
          "description": "导入结果摘要，展示总数、成功、失败三个标签；字段为 total / success / failed",
          "type": "ImportResultSummary",
          "default": "undefined"
        },
        {
          "name": "loading",
          "description": "是否加载中",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [],
      "slots": [],
      "exposes": []
    },
    {
      "name": "audit-timeline",
      "title": "AuditTimeline 审计时间线",
      "description": "面向后台操作记录、审批流和变更历史的增强时间线。",
      "tags": [
        "xy-audit-timeline"
      ],
      "exports": [
        "XyAuditTimeline"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "items",
          "description": "历史记录列表",
          "type": "AuditTimelineEntry[]",
          "default": "[]"
        },
        {
          "name": "empty-text",
          "description": "空态说明文案",
          "type": "string",
          "default": "'暂时还没有审计记录'"
        },
        {
          "name": "compact",
          "description": "是否启用紧凑模式",
          "type": "boolean",
          "default": "false"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "title",
          "description": "自定义标题区",
          "props": ""
        },
        {
          "name": "meta",
          "description": "自定义操作者 / 状态区",
          "props": ""
        },
        {
          "name": "default",
          "description": "自定义正文区",
          "props": ""
        },
        {
          "name": "actions",
          "description": "自定义右侧动作",
          "props": ""
        },
        {
          "name": "attachments",
          "description": "自定义附件区",
          "props": ""
        },
        {
          "name": "extra",
          "description": "自定义扩展区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "detail-panel",
      "title": "DetailPanel 详情承载面板",
      "description": "统一抽屉与弹窗详情查看的只读面板模型。",
      "tags": [
        "xy-detail-panel"
      ],
      "exports": [
        "XyDetailPanel"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "open",
          "description": "是否打开",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "container",
          "description": "容器类型",
          "type": "'drawer' | 'dialog'",
          "default": "'drawer'"
        },
        {
          "name": "title",
          "description": "标题",
          "type": "string",
          "default": "'详情信息'"
        },
        {
          "name": "description",
          "description": "说明文案",
          "type": "string",
          "default": "''"
        },
        {
          "name": "loading",
          "description": "是否显示加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "model",
          "description": "当前详情数据对象",
          "type": "Record<string, unknown>",
          "default": "{}"
        },
        {
          "name": "schema",
          "description": "只读详情字段 schema，复用增强层显示协议",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "descriptions-props",
          "description": "透传给内置 xy-descriptions 的属性",
          "type": "Omit<DescriptionsProps, 'items' | 'title' | 'extra'>",
          "default": "{}"
        },
        {
          "name": "drawer-props",
          "description": "透传给抽屉容器的属性",
          "type": "Partial<DrawerProps>",
          "default": "{}"
        },
        {
          "name": "dialog-props",
          "description": "透传给弹窗容器的属性",
          "type": "Partial<DialogProps>",
          "default": "{}"
        }
      ],
      "events": [
        {
          "name": "update:open",
          "description": "打开状态变化时派发",
          "params": "(value: boolean) => void"
        },
        {
          "name": "closed",
          "description": "面板完全关闭后派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "主内容区",
          "props": ""
        },
        {
          "name": "description",
          "description": "头部说明区",
          "props": ""
        },
        {
          "name": "meta",
          "description": "头部右侧元信息，仅抽屉容器生效",
          "props": ""
        },
        {
          "name": "timeline",
          "description": "历史记录区",
          "props": ""
        },
        {
          "name": "actions",
          "description": "底部动作区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "detail-page",
      "title": "DetailPage 详情页面容器",
      "description": "统一页面头部、详情分组、附件、差异和日志的详情页容器。",
      "tags": [
        "xy-detail-page"
      ],
      "exports": [
        "XyDetailPage"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "页面标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "页面描述",
          "type": "string",
          "default": "''"
        },
        {
          "name": "breadcrumbs",
          "description": "面包屑配置",
          "type": "DetailPageBreadcrumbItem[]",
          "default": "[]"
        },
        {
          "name": "actions",
          "description": "头部操作按钮组",
          "type": "DetailPageAction[]",
          "default": "[]"
        },
        {
          "name": "loading",
          "description": "是否加载中",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "error",
          "description": "错误信息，非空时进入错误态",
          "type": "string | null",
          "default": "null"
        },
        {
          "name": "sections",
          "description": "详情分组配置",
          "type": "DetailSectionItem[]",
          "default": "[]"
        },
        {
          "name": "attachments",
          "description": "附件列表",
          "type": "DetailPageAttachmentFile[]",
          "default": "[]"
        },
        {
          "name": "changes",
          "description": "变更对比数据，status 为 'same' 的项不展示",
          "type": "ChangeDiffItem[]",
          "default": "[]"
        },
        {
          "name": "logs",
          "description": "操作日志数据",
          "type": "AuditTimelineEntry[]",
          "default": "[]"
        }
      ],
      "events": [
        {
          "name": "retry",
          "description": "error 非空进入错误态后，点击错误区「重新加载」按钮时触发",
          "params": ""
        }
      ],
      "slots": [
        {
          "name": "meta",
          "description": "头部标题旁的元信息区",
          "props": "—"
        },
        {
          "name": "actions",
          "description": "头部操作区，默认渲染 actions 按钮",
          "props": "—"
        },
        {
          "name": "[section.key]",
          "description": "各详情分组的内容，默认按 items / schema + model 渲染描述列表",
          "props": "{ section: DetailSectionItem }"
        }
      ],
      "exposes": []
    },
    {
      "name": "async-state-container",
      "title": "AsyncStateContainer 异步状态容器",
      "description": "统一 loading、error、empty 和 content 四种异步状态。",
      "tags": [
        "xy-async-state-container"
      ],
      "exports": [
        "XyAsyncStateContainer"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "loading",
          "description": "是否加载中，为 true 时优先展示加载态",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "error",
          "description": "错误信息，非空时展示错误态",
          "type": "string | null",
          "default": "null"
        },
        {
          "name": "empty",
          "description": "是否为空态，仅在非加载且无错误时生效",
          "type": "boolean",
          "default": "false"
        },
        {
          "name": "empty-title",
          "description": "空态标题",
          "type": "string",
          "default": "'暂无数据'"
        },
        {
          "name": "empty-description",
          "description": "空态描述",
          "type": "string",
          "default": "'当前条件下没有可展示的内容。'"
        },
        {
          "name": "loading-text",
          "description": "加载态文案",
          "type": "string",
          "default": "'正在加载数据'"
        }
      ],
      "events": [
        {
          "name": "retry",
          "description": "点击错误态内置的「重新加载」按钮时派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "正常内容区",
          "props": "—"
        },
        {
          "name": "loading",
          "description": "自定义加载态",
          "props": "—"
        },
        {
          "name": "error",
          "description": "自定义错误态",
          "props": "{ error: string | null }"
        },
        {
          "name": "empty",
          "description": "自定义空态",
          "props": "—"
        }
      ],
      "exposes": []
    },
    {
      "name": "list-page",
      "title": "ListPage 列表页面容器",
      "description": "统一筛选栏、列表、批量动作和请求状态的页面容器。",
      "tags": [
        "xy-list-page"
      ],
      "exports": [
        "XyListPage"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "工具栏标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "工具栏说明",
          "type": "string",
          "default": "''"
        },
        {
          "name": "search-model",
          "description": "搜索表单数据",
          "type": "Record<string, unknown>",
          "default": "{}"
        },
        {
          "name": "search-fields",
          "description": "搜索表单字段配置",
          "type": "SearchFormField[]",
          "default": "[]"
        },
        {
          "name": "data",
          "description": "表格数据",
          "type": "T[]",
          "default": "[]"
        },
        {
          "name": "columns",
          "description": "列 schema 数组",
          "type": "ProTableColumn<T>[]",
          "default": "—"
        },
        {
          "name": "request",
          "description": "远程请求函数，传入后启用分页区",
          "type": "(params: Record<string, unknown>, ctx: ProRequestContext) => Promise<ProRequestResult<T>>",
          "default": "undefined"
        },
        {
          "name": "toolbar-actions",
          "description": "工具栏按钮组",
          "type": "ProPageAction[]",
          "default": "[]"
        },
        {
          "name": "batch-actions",
          "description": "批量动作按钮组",
          "type": "ListPageBatchAction[]",
          "default": "[]"
        },
        {
          "name": "immediate",
          "description": "挂载后是否立即发起远程请求",
          "type": "boolean",
          "default": "true"
        },
        {
          "name": "page-size",
          "description": "默认每页条数",
          "type": "number",
          "default": "10"
        },
        {
          "name": "workbench",
          "description": "工作台配置，透传给内部 xy-pro-table",
          "type": "ProTableWorkbenchConfig",
          "default": "{}"
        },
        {
          "name": "editable",
          "description": "编辑模式配置",
          "type": "ProTableEditableConfig<T>",
          "default": "undefined"
        },
        {
          "name": "virtual",
          "description": "虚拟列表配置",
          "type": "ProTableVirtualConfig",
          "default": "undefined"
        }
      ],
      "events": [
        {
          "name": "toolbar-action",
          "description": "点击工具栏按钮时派发",
          "params": "(action: ProPageAction) => void"
        },
        {
          "name": "batch-action",
          "description": "点击批量动作时派发",
          "params": "(action: ListPageBatchAction, selection: Record<string, unknown>[]) => void"
        },
        {
          "name": "selection-change",
          "description": "表格选中行变化时派发",
          "params": "(selection: Record<string, unknown>[]) => void"
        },
        {
          "name": "request-success",
          "description": "远程请求成功时派发",
          "params": "(payload: Record<string, unknown>[]) => void"
        },
        {
          "name": "request-error",
          "description": "远程请求失败时派发",
          "params": "(error: unknown) => void"
        }
      ],
      "slots": [
        {
          "name": "toolbar-main",
          "description": "自定义标题区",
          "props": "—"
        },
        {
          "name": "toolbar-left",
          "description": "工具栏右侧操作区前置内容",
          "props": "—"
        },
        {
          "name": "toolbar-meta",
          "description": "工具栏右侧操作区补充内容",
          "props": "—"
        },
        {
          "name": "toolbar-right",
          "description": "工具栏右侧操作区尾部内容",
          "props": "—"
        },
        {
          "name": "search",
          "description": "自定义搜索区",
          "props": "—"
        },
        {
          "name": "footer-meta",
          "description": "分页左侧补充信息",
          "props": "—"
        },
        {
          "name": "loading",
          "description": "自定义加载态",
          "props": "透传 ProTable 对应插槽参数"
        },
        {
          "name": "empty",
          "description": "自定义空态",
          "props": "透传 ProTable 对应插槽参数"
        },
        {
          "name": "其他具名插槽",
          "description": "透传给内部 xy-pro-table 的同名插槽（如单元格自定义插槽）",
          "props": "对应插槽参数"
        }
      ],
      "exposes": [
        {
          "name": "reload",
          "description": "以当前参数重新发起远程请求",
          "type": "() => Promise<void>"
        },
        {
          "name": "refresh",
          "description": "刷新当前页数据",
          "type": "() => Promise<void>"
        },
        {
          "name": "reset",
          "description": "重置搜索、筛选、分页和选中行后重新加载",
          "type": "() => Promise<void>"
        },
        {
          "name": "clearSelection",
          "description": "清空表格选中行",
          "type": "() => void"
        }
      ]
    },
    {
      "name": "crud-page",
      "title": "CrudPage 增删改查页面",
      "description": "统一列表、表单编辑和详情查看的页面级容器。",
      "tags": [
        "xy-crud-page"
      ],
      "exports": [
        "XyCrudPage"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "工具栏标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "工具栏说明",
          "type": "string",
          "default": "''"
        },
        {
          "name": "search-model",
          "description": "搜索表单数据",
          "type": "Record<string, unknown>",
          "default": "{}"
        },
        {
          "name": "search-fields",
          "description": "搜索表单字段配置",
          "type": "SearchFormField[]",
          "default": "[]"
        },
        {
          "name": "data",
          "description": "表格数据",
          "type": "T[]",
          "default": "[]"
        },
        {
          "name": "columns",
          "description": "列 schema 数组",
          "type": "ProTableColumn<T>[]",
          "default": "—"
        },
        {
          "name": "toolbar-actions",
          "description": "自定义工具栏按钮组，组件会额外内置一个「新建」按钮",
          "type": "ProPageAction[]",
          "default": "[]"
        },
        {
          "name": "batch-actions",
          "description": "批量动作按钮组",
          "type": "ListPageBatchAction[]",
          "default": "[]"
        },
        {
          "name": "form-model",
          "description": "编辑表单数据模型，需传入响应式对象",
          "type": "Record<string, unknown>",
          "default": "—"
        },
        {
          "name": "form-schema",
          "description": "编辑表单字段 schema",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "form-rules",
          "description": "编辑表单校验规则",
          "type": "Record<string, RuleItem & { required?: boolean; trigger?: 'blur' | 'change' | ('blur' | 'change')[] }[]>",
          "default": "{}"
        },
        {
          "name": "form-type",
          "description": "编辑表单容器类型",
          "type": "'drawer' / 'modal'",
          "default": "'drawer'"
        },
        {
          "name": "detail-schema",
          "description": "详情字段 schema",
          "type": "ProFieldSchema[]",
          "default": "[]"
        },
        {
          "name": "detail-descriptions-props",
          "description": "详情描述列表额外 props",
          "type": "Omit<DescriptionsProps, 'items' | 'title' | 'extra'>",
          "default": "{}"
        },
        {
          "name": "detail-type",
          "description": "详情面板容器类型，为 'none' 时关闭详情面板",
          "type": "'drawer' / 'dialog' / 'none'",
          "default": "'drawer'"
        }
      ],
      "events": [
        {
          "name": "submit",
          "description": "编辑表单提交时派发",
          "params": "(payload: Record<string, unknown>) => void"
        },
        {
          "name": "open-create",
          "description": "点击「新建」打开编辑表单时派发",
          "params": "() => void"
        },
        {
          "name": "open-edit",
          "description": "点击「编辑」打开编辑表单时派发",
          "params": "(row: Record<string, unknown>) => void"
        },
        {
          "name": "open-detail",
          "description": "点击「查看」打开详情面板时派发",
          "params": "(row: Record<string, unknown>) => void"
        },
        {
          "name": "toolbar-action",
          "description": "点击自定义工具栏按钮时派发，create 由组件内部处理",
          "params": "(action: ProPageAction) => void"
        },
        {
          "name": "batch-action",
          "description": "点击批量动作时派发",
          "params": "(action: ListPageBatchAction, selection: Record<string, unknown>[]) => void"
        },
        {
          "name": "selection-change",
          "description": "表格选中行变化时派发",
          "params": "(selection: Record<string, unknown>[]) => void"
        },
        {
          "name": "request-success",
          "description": "远程请求成功时派发",
          "params": "(payload: Record<string, unknown>[]) => void"
        },
        {
          "name": "request-error",
          "description": "远程请求失败时派发",
          "params": "(error: unknown) => void"
        }
      ],
      "slots": [
        {
          "name": "form",
          "description": "编辑表单内容区，覆盖默认 schema 渲染",
          "props": "{ row: Record<string, unknown> | null, model: Record<string, unknown> }"
        },
        {
          "name": "detail",
          "description": "详情面板内容区，覆盖默认 schema 渲染",
          "props": "{ row: Record<string, unknown> | null }"
        },
        {
          "name": "actions",
          "description": "行操作区自定义按钮，追加在内置「查看 / 编辑」按钮之后",
          "props": "{ row: Record<string, unknown> }"
        },
        {
          "name": "其他具名插槽",
          "description": "透传给内部 ListPage 的同名插槽",
          "props": "对应插槽参数"
        }
      ],
      "exposes": []
    },
    {
      "name": "split-layout-page",
      "title": "SplitLayoutPage 分栏页面",
      "description": "统一主从布局与侧栏布局的页面级分栏模型。",
      "tags": [
        "xy-split-layout-page"
      ],
      "exports": [
        "XySplitLayoutPage"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "页面标题",
          "type": "string",
          "default": "''"
        },
        {
          "name": "description",
          "description": "页面说明",
          "type": "string",
          "default": "''"
        },
        {
          "name": "layout",
          "description": "分栏布局模式",
          "type": "'master-detail' | 'aside-main'",
          "default": "'aside-main'"
        },
        {
          "name": "primary-size",
          "description": "主栏宽度",
          "type": "string",
          "default": "master-detail 为 '38%'，aside-main 为 '28%'"
        }
      ],
      "events": [],
      "slots": [
        {
          "name": "master",
          "description": "主从模式左侧区",
          "props": ""
        },
        {
          "name": "detail",
          "description": "主从模式右侧区",
          "props": ""
        },
        {
          "name": "aside",
          "description": "侧栏模式左侧区",
          "props": ""
        },
        {
          "name": "main",
          "description": "侧栏模式右侧区",
          "props": ""
        }
      ],
      "exposes": []
    },
    {
      "name": "approval-flow-panel",
      "title": "ApprovalFlowPanel 审批流面板",
      "description": "用统一步骤和节点区承接审批流可视化。",
      "tags": [
        "xy-approval-flow-panel"
      ],
      "exports": [
        "XyApprovalFlowPanel"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "面板标题",
          "type": "string",
          "default": "'审批流程'"
        },
        {
          "name": "nodes",
          "description": "审批节点配置",
          "type": "ApprovalFlowNode[]",
          "default": "—"
        },
        {
          "name": "actions",
          "description": "底部动作按钮组",
          "type": "ApprovalFlowAction[]",
          "default": "[]"
        }
      ],
      "events": [
        {
          "name": "action",
          "description": "点击动作按钮时派发",
          "params": "(action: ApprovalFlowAction) => void"
        },
        {
          "name": "node-click",
          "description": "点击节点卡片时派发",
          "params": "(node: { key: string }) => void"
        }
      ],
      "slots": [
        {
          "name": "actions",
          "description": "自定义动作区内容，覆盖默认动作按钮",
          "props": "—"
        }
      ],
      "exposes": []
    },
    {
      "name": "import-wizard",
      "title": "ImportWizard 导入向导",
      "description": "用统一步骤流承接导入流程的多阶段操作。",
      "tags": [
        "xy-import-wizard"
      ],
      "exports": [
        "XyImportWizard"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "向导标题",
          "type": "string",
          "default": "'导入向导'"
        },
        {
          "name": "steps",
          "description": "步骤配置",
          "type": "ImportWizardStep[]",
          "default": "—"
        },
        {
          "name": "active",
          "description": "当前步骤索引，受控模式",
          "type": "number",
          "default": "undefined"
        },
        {
          "name": "default-active",
          "description": "默认步骤索引，仅在非受控模式生效",
          "type": "number",
          "default": "0"
        }
      ],
      "events": [
        {
          "name": "update:active",
          "description": "当前步骤变化时派发，支持 v-model:active",
          "params": "(value: number) => void"
        },
        {
          "name": "prev",
          "description": "点击「上一步」时派发",
          "params": "(value: number) => void"
        },
        {
          "name": "next",
          "description": "点击「下一步」时派发",
          "params": "(value: number) => void"
        },
        {
          "name": "finish",
          "description": "在最后一步点击「完成」时派发",
          "params": "() => void"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "当前阶段的内容区",
          "props": "{ step: ImportWizardStep | undefined, active: number }"
        }
      ],
      "exposes": []
    },
    {
      "name": "export-task-panel",
      "title": "ExportTaskPanel 导出任务面板",
      "description": "用统一列表承接后台导出任务状态。",
      "tags": [
        "xy-export-task-panel"
      ],
      "exports": [
        "XyExportTaskPanel"
      ],
      "layer": "pro",
      "props": [
        {
          "name": "title",
          "description": "面板标题",
          "type": "string",
          "default": "'导出任务'"
        },
        {
          "name": "tasks",
          "description": "导出任务列表",
          "type": "ExportTaskItem[]",
          "default": "—"
        }
      ],
      "events": [
        {
          "name": "download",
          "description": "点击成功任务的「下载」按钮时派发",
          "params": "(task: ExportTaskItem) => void"
        },
        {
          "name": "retry",
          "description": "点击失败任务的「重试」按钮时派发",
          "params": "(task: ExportTaskItem) => void"
        },
        {
          "name": "remove",
          "description": "点击任务的「移除」按钮时派发",
          "params": "(task: ExportTaskItem) => void"
        }
      ],
      "slots": [],
      "exposes": []
    }
  ]
};
