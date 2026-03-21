const componentName = process.argv[2];

if (!componentName) {
  console.log("用法: pnpm exec node scripts/gen-component.mjs <component-name>");
  process.exit(0);
}

console.log(
  `当前仓库已经按 packages/components/<name> + packages/theme/src/components/<name>.css 建立约定，请按该约定手动补充组件源码和文档。组件导出使用 Xy${componentName
    .split("-")
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join("")}，模板标签统一使用 <${componentName}>。目标组件: ${componentName}`
);
