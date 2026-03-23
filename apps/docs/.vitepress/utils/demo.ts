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
    if (!/^:::\s*demo\b/.test(lines[index].trim())) {
      continue;
    }

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
