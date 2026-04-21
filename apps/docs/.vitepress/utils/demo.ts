function toPascalCase(value: string) {
  return value
    .split(/[-/]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

export function getDemoComponentName(demoPath: string) {
  return `XyDemo${toPascalCase(demoPath)}`;
}

export function extractDemoPaths(code: string) {
  const lines = code.split(/\r?\n/);
  const paths: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    const matched = trimmed.match(/^:::\s*demo\s*(.*)$/);

    if (!matched) {
      continue;
    }

    // 单行形式: :::demo path/to/example — 路径在 matched[1]
    const afterDemo = matched[1]?.trim();
    if (afterDemo) {
      // 判断 matched[1] 是否像文件路径（纯 ASCII 字母数字+连字符/斜杠/点）
      if (/^[a-zA-Z0-9_/.-]+$/.test(afterDemo)) {
        paths.push(afterDemo);
        continue;
      }
    }

    // 两行形式: :::demo description\npath/to/example\n:::
    let cursor = index + 1;

    while (cursor < lines.length) {
      const line = lines[cursor].trim();

      if (!line) {
        cursor += 1;
        continue;
      }

      if (line === ":::") {
        break;
      }

      paths.push(line);
      break;
    }
  }

  return [...new Set(paths)];
}
