import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const packageTargets = {
  base: {
    distDir: path.resolve("packages/xiaoye-components/dist"),
    entryPath: "xiaoye-components/index.js",
    packageName: "xiaoye-components"
  },
  pro: {
    distDir: path.resolve("packages/xiaoye-pro-components/dist"),
    entryPath: "xiaoye-pro-components/index.js",
    packageName: "xiaoye-pro-components"
  }
};

const targetName = process.argv[2];
const target = packageTargets[targetName];

if (!target) {
  console.error("用法：node scripts/prepare-package.mjs <base|pro>");
  process.exit(1);
}

const typesDir = path.join(target.distDir, "types");

if (!fs.existsSync(typesDir)) {
  console.error(`未找到类型产物目录：${typesDir}`);
  process.exit(1);
}

function walkDir(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return walkDir(entryPath);
    }
    return entryPath.endsWith(".d.ts") ? [entryPath] : [];
  });
}

function normalizeRelativeSpecifier(filePath, specifier) {
  let normalized = specifier.replace(/\/index\.d?\.ts\//g, "/");
  normalized = normalized.replace(/\/index\.ts\//g, "/");

  if (normalized.endsWith(".js") || normalized.endsWith(".mjs") || normalized.endsWith(".cjs")) {
    return normalized;
  }

  if (normalized.endsWith(".vue")) {
    return `${normalized}.js`;
  }

  if (normalized.endsWith(".css") || normalized.endsWith(".json")) {
    return normalized;
  }

  let bareSpecifier = normalized;

  if (bareSpecifier.endsWith(".d.ts")) {
    bareSpecifier = bareSpecifier.slice(0, -5);
  } else if (
    bareSpecifier.endsWith(".ts") ||
    bareSpecifier.endsWith(".mts") ||
    bareSpecifier.endsWith(".cts")
  ) {
    bareSpecifier = bareSpecifier.replace(/\.[cm]?ts$/, "");
  }

  const currentDir = path.dirname(filePath);
  const bareTargetPath = path.resolve(currentDir, bareSpecifier);

  if (fs.existsSync(`${bareTargetPath}.d.ts`)) {
    return `${bareSpecifier}.js`;
  }

  if (fs.existsSync(path.join(bareTargetPath, "index.d.ts"))) {
    return `${bareSpecifier}/index.js`;
  }

  if (!path.extname(bareSpecifier)) {
    return `${bareSpecifier}.js`;
  }

  return bareSpecifier;
}

function normalizeSpecifier(filePath, specifier) {
  if (specifier === "@xiaoye/components") {
    return "xiaoye-components";
  }

  if (specifier === "@xiaoye/pro-components") {
    return "xiaoye-pro-components";
  }

  if (!specifier.startsWith(".")) {
    return specifier;
  }

  return normalizeRelativeSpecifier(filePath, specifier);
}

function rewriteSpecifiers(filePath, source) {
  const withSpecifiers = source.replace(
    /(from\s*["']|import\s*\(\s*["'])([^"']+)(["'])/g,
    (_match, prefix, specifier, suffix) => {
      return `${prefix}${normalizeSpecifier(filePath, specifier)}${suffix}`;
    }
  );

  return withSpecifiers.replace(/\(\(event: "([^"]+)", event: /g, '((event: "$1", payload: ');
}

function rewriteRootTypesEntry(entryPath, entryTarget) {
  const source = [
    `export * from "./${entryTarget}";`,
    `import XiaoyePackage from "./${entryTarget}";`,
    "export default XiaoyePackage;",
    ""
  ].join("\n");

  fs.writeFileSync(entryPath, source, "utf8");
}

function isPublicEntryDeclaration(filePath) {
  const normalizedPath = filePath.split(path.sep).join("/");
  return /\/types\/(components|pro-components)\/[^/]+\/index\.d\.ts$/.test(normalizedPath);
}

function findStatementEnd(source, startIndex) {
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    const previousChar = source[index - 1];

    if (inSingleQuote) {
      if (char === "'" && previousChar !== "\\") {
        inSingleQuote = false;
      }
      continue;
    }

    if (inDoubleQuote) {
      if (char === '"' && previousChar !== "\\") {
        inDoubleQuote = false;
      }
      continue;
    }

    if (inTemplate) {
      if (char === "`" && previousChar !== "\\") {
        inTemplate = false;
      }
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      continue;
    }

    if (char === "`") {
      inTemplate = true;
      continue;
    }

    if (char === "{") {
      braceDepth += 1;
      continue;
    }

    if (char === "}") {
      braceDepth -= 1;
      continue;
    }

    if (char === "[") {
      bracketDepth += 1;
      continue;
    }

    if (char === "]") {
      bracketDepth -= 1;
      continue;
    }

    if (char === "(") {
      parenDepth += 1;
      continue;
    }

    if (char === ")") {
      parenDepth -= 1;
      continue;
    }

    if (char === ";" && braceDepth === 0 && bracketDepth === 0 && parenDepth === 0) {
      return index;
    }
  }

  return source.length - 1;
}

function findGenericEnd(source, startIndex) {
  let angleDepth = 1;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    const previousChar = source[index - 1];

    if (char === "<") {
      angleDepth += 1;
      continue;
    }

    if (char === ">" && previousChar !== "=") {
      angleDepth -= 1;

      if (angleDepth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function simplifySfcAnnotation(annotation) {
  const token = "SFCWithInstall<";
  let cursor = 0;
  let rewritten = "";

  while (cursor < annotation.length) {
    const start = annotation.indexOf(token, cursor);

    if (start === -1) {
      rewritten += annotation.slice(cursor);
      break;
    }

    rewritten += annotation.slice(cursor, start);
    const genericStart = start + token.length;
    const genericEnd = findGenericEnd(annotation, genericStart);

    if (genericEnd === -1) {
      rewritten += annotation.slice(start);
      break;
    }

    rewritten += "SFCWithInstall<any>";
    cursor = genericEnd + 1;
  }

  return rewritten;
}

function simplifyPublicEntryDeclarations(source) {
  const declarationPattern = /export declare const [A-Za-z0-9_$]+\s*:/g;
  let match;
  let cursor = 0;
  let rewritten = "";

  while ((match = declarationPattern.exec(source)) !== null) {
    const statementStart = match.index;
    const colonIndex = declarationPattern.lastIndex - 1;
    const statementEnd = findStatementEnd(source, colonIndex + 1);
    const statementBody = source.slice(colonIndex + 1, statementEnd);

    rewritten += source.slice(cursor, statementStart);

    if (statementBody.includes("SFCWithInstall<")) {
      rewritten += source.slice(statementStart, colonIndex + 1);
      rewritten += simplifySfcAnnotation(statementBody);
      rewritten += ";";
    } else {
      rewritten += source.slice(statementStart, statementEnd + 1);
    }

    cursor = statementEnd + 1;
    declarationPattern.lastIndex = cursor;
  }

  rewritten += source.slice(cursor);
  return rewritten;
}

function simplifyVueInstanceAliases(source) {
  return source.replace(
    /export type (\w+Instance)\s*=\s*InstanceType<typeof\s+\w+>(\s*&\s*\{[^;]*\})?;/g,
    (_match, typeName, suffix = "") => {
      return `export type ${typeName} = any${suffix};`;
    }
  );
}

function removeUnusedVueDefaultImports(source) {
  const matches = [
    ...source.matchAll(
      /^import(?:\s+\{\s*default as\s+([A-Za-z0-9_$]+)\s*\}\s+from|\s+([A-Za-z0-9_$]+)\s+from)\s+['"][^'"]+\.vue\.js['"];\n?/gm
    )
  ];
  let rewritten = source;

  matches.forEach((match) => {
    const fullMatch = match[0];
    const identifier = match[1] ?? match[2];
    const usagePattern = new RegExp(`\\b${identifier}\\b`, "g");
    const usageCount = [...rewritten.matchAll(usagePattern)].length;

    if (usageCount <= 1) {
      rewritten = rewritten.replace(fullMatch, "");
    }
  });

  return rewritten;
}

function writeCssTypes() {
  const styleTypesPath = path.join(target.distDir, "style.css.d.ts");
  const styleTypesSource = [
    "declare const stylesheet: string;",
    "export default stylesheet;",
    ""
  ].join("\n");

  fs.writeFileSync(styleTypesPath, styleTypesSource, "utf8");
}

function rewriteSourceSpecifier(sourceFilePath, distFilePath, specifier) {
  if (specifier === "@xiaoye/utils") {
    return (
      path.posix.relative(
        path.posix.dirname(path.relative(typesDir, distFilePath).split(path.sep).join("/")),
        "utils/index.js"
      ) || "./utils/index.js"
    );
  }

  const normalizedPath = specifier.replace(/\\/g, "/");

  if (normalizedPath.startsWith(".")) {
    if (normalizedPath.endsWith(".vue")) {
      return `${normalizedPath}.js`;
    }

    if (/\.[cm]?tsx?$/.test(normalizedPath)) {
      return normalizedPath.replace(/\.[cm]?tsx?$/, ".js");
    }

    return `${normalizedPath}.js`;
  }

  return specifier;
}

function groupEntriesBySource(entries) {
  const groups = new Map();

  entries.forEach((entry) => {
    const current = groups.get(entry.source) ?? [];
    current.push(entry);
    groups.set(entry.source, current);
  });

  return groups;
}

function renderNamedEntries(entries) {
  return entries
    .map((entry) =>
      entry.importedName === entry.localName
        ? entry.localName
        : `${entry.importedName} as ${entry.localName}`
    )
    .join(", ");
}

function rewriteLocalTypeDeclaration(sourceText) {
  return sourceText.replace(/InstanceType<typeof\s+\w+>/g, "any");
}

function buildValueDeclaration(valueEntry, propertyAssignments, uses) {
  if (valueEntry.kind === "withInstall") {
    uses.sfc = true;
    const properties = propertyAssignments.get(valueEntry.name) ?? [];
    const extension =
      properties.length > 0
        ? ` & {\n${properties
            .map((property) => `  ${property.propertyName}: typeof ${property.targetName};`)
            .join("\n")}\n}`
        : "";

    return `export declare const ${valueEntry.name}: SFCWithInstall<any>${extension};`;
  }

  if (valueEntry.kind === "withInstallFunction") {
    uses.functionInstall = true;
    return `export declare const ${valueEntry.name}: FunctionWithInstall<any>;`;
  }

  if (valueEntry.kind === "alias" && valueEntry.aliasTarget) {
    return `export declare const ${valueEntry.name}: typeof ${valueEntry.aliasTarget};`;
  }

  return null;
}

function rewriteModuleIndexDeclaration(sourceIndexPath, distIndexPath) {
  const sourceText = fs.readFileSync(sourceIndexPath, "utf8");
  const sourceFile = ts.createSourceFile(sourceIndexPath, sourceText, ts.ScriptTarget.Latest, true);

  const importMap = new Map();
  const typeExportEntries = [];
  const runtimeReExportEntries = [];
  const rawTypeDeclarations = [];
  const valueEntries = [];
  const propertyAssignments = new Map();
  let defaultExportName = null;

  function addImportEntry(localName, entry) {
    importMap.set(localName, entry);
  }

  function collectImportSpecifiers(statement) {
    const clause = statement.importClause;
    if (!clause) {
      return;
    }

    const source = statement.moduleSpecifier.text;

    if (clause.name) {
      addImportEntry(clause.name.text, {
        source,
        importedName: "default",
        localName: clause.name.text,
        defaultImport: true,
        typeOnly: clause.isTypeOnly
      });
    }

    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      clause.namedBindings.elements.forEach((element) => {
        addImportEntry(element.name.text, {
          source,
          importedName: element.propertyName?.text ?? element.name.text,
          localName: element.name.text,
          defaultImport: false,
          typeOnly: clause.isTypeOnly || element.isTypeOnly
        });
      });
    }
  }

  sourceFile.statements.forEach((statement) => {
    if (ts.isImportDeclaration(statement)) {
      collectImportSpecifiers(statement);
      return;
    }

    if (
      (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      rawTypeDeclarations.push(statement.getText(sourceFile));
      return;
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause) &&
      !statement.moduleSpecifier
    ) {
      const target = statement.isTypeOnly ? typeExportEntries : runtimeReExportEntries;

      statement.exportClause.elements.forEach((element) => {
        const localName = element.propertyName?.text ?? element.name.text;
        target.push(localName);
      });
      return;
    }

    if (
      ts.isVariableStatement(statement) &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      statement.declarationList.declarations.forEach((declaration) => {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
          return;
        }

        const initializerText = declaration.initializer.getText(sourceFile);
        const aliasMatch = initializerText.match(/^\s*([A-Za-z_]\w*)\s*$/);
        let kind = "other";
        let aliasTarget = null;

        if (initializerText.includes("withInstallFunction(")) {
          kind = "withInstallFunction";
        } else if (initializerText.includes("withInstall(")) {
          kind = "withInstall";
        } else if (aliasMatch) {
          kind = "alias";
          aliasTarget = aliasMatch[1];
        }

        valueEntries.push({
          name: declaration.name.text,
          kind,
          aliasTarget
        });
      });
      return;
    }

    if (
      ts.isExpressionStatement(statement) &&
      ts.isBinaryExpression(statement.expression) &&
      statement.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(statement.expression.left) &&
      ts.isIdentifier(statement.expression.left.expression) &&
      ts.isIdentifier(statement.expression.right)
    ) {
      const owner = statement.expression.left.expression.text;
      const assignments = propertyAssignments.get(owner) ?? [];

      assignments.push({
        propertyName: statement.expression.left.name.text,
        targetName: statement.expression.right.text
      });

      propertyAssignments.set(owner, assignments);
      return;
    }

    if (ts.isExportAssignment(statement) && ts.isIdentifier(statement.expression)) {
      defaultExportName = statement.expression.text;
    }
  });

  const shouldRewrite = valueEntries.some((entry) =>
    ["withInstall", "withInstallFunction", "alias"].includes(entry.kind)
  );

  if (!shouldRewrite) {
    return;
  }

  const outputLines = [];
  const uses = {
    sfc: false,
    functionInstall: false
  };

  const rewrittenRawTypeDeclarations = rawTypeDeclarations.map((declarationText) =>
    rewriteLocalTypeDeclaration(declarationText)
  );
  const rawTypeImportEntries = [];

  rewrittenRawTypeDeclarations.forEach((declarationText) => {
    for (const [localName, entry] of importMap.entries()) {
      const identifierPattern = new RegExp(`\\b${localName}\\b`);

      if (identifierPattern.test(declarationText)) {
        rawTypeImportEntries.push(entry);
      }
    }
  });

  const rawTypeImportGroups = groupEntriesBySource(
    Array.from(
      new Map(
        rawTypeImportEntries.map((entry) => [
          `${entry.source}:${entry.importedName}:${entry.localName}:${entry.defaultImport}:${entry.typeOnly}`,
          entry
        ])
      ).values()
    )
  );

  for (const [source, entries] of rawTypeImportGroups.entries()) {
    const rewrittenSource = rewriteSourceSpecifier(sourceIndexPath, distIndexPath, source);
    const defaultImports = entries.filter((entry) => entry.defaultImport);
    const namedImports = entries.filter((entry) => !entry.defaultImport);

    if (defaultImports.length > 0) {
      defaultImports.forEach((entry) => {
        outputLines.push(`import ${entry.localName} from "${rewrittenSource}";`);
      });
    }

    if (namedImports.length > 0) {
      outputLines.push(
        `import type { ${renderNamedEntries(namedImports)} } from "${rewrittenSource}";`
      );
    }
  }

  const typeReExportEntries = typeExportEntries
    .map((localName) => {
      const entry = importMap.get(localName);

      if (!entry) {
        return null;
      }

      return entry;
    })
    .filter(Boolean);

  const typeReExportGroups = groupEntriesBySource(typeReExportEntries);

  if (typeReExportGroups.size > 0) {
    if (outputLines.length > 0) {
      outputLines.push("");
    }

    for (const [source, entries] of typeReExportGroups.entries()) {
      const rewrittenSource = rewriteSourceSpecifier(sourceIndexPath, distIndexPath, source);
      outputLines.push(`export type { ${renderNamedEntries(entries)} } from "${rewrittenSource}";`);
    }
  }

  if (rewrittenRawTypeDeclarations.length > 0) {
    if (outputLines.length > 0) {
      outputLines.push("");
    }

    rewrittenRawTypeDeclarations.forEach((declarationText) => {
      outputLines.push(declarationText);
    });
  }

  const valueDeclarationLines = valueEntries
    .map((entry) => buildValueDeclaration(entry, propertyAssignments, uses))
    .filter(Boolean);

  if (valueDeclarationLines.length > 0) {
    if (outputLines.length > 0) {
      outputLines.push("");
    }

    const utilityTypes = [
      uses.sfc ? "SFCWithInstall" : null,
      uses.functionInstall ? "FunctionWithInstall" : null
    ].filter(Boolean);

    if (utilityTypes.length > 0) {
      outputLines.push(`import type { ${utilityTypes.join(", ")} } from "../../utils/index.js";`);
      outputLines.push("");
    }

    outputLines.push(...valueDeclarationLines);
  }

  const runtimeReExportEntriesResolved = runtimeReExportEntries
    .map((localName) => {
      const entry = importMap.get(localName);

      if (!entry) {
        return null;
      }

      return entry;
    })
    .filter(Boolean);

  const runtimeReExportGroups = groupEntriesBySource(runtimeReExportEntriesResolved);

  if (runtimeReExportGroups.size > 0) {
    if (outputLines.length > 0) {
      outputLines.push("");
    }

    for (const [source, entries] of runtimeReExportGroups.entries()) {
      const rewrittenSource = rewriteSourceSpecifier(sourceIndexPath, distIndexPath, source);
      outputLines.push(`export { ${renderNamedEntries(entries)} } from "${rewrittenSource}";`);
    }
  }

  if (defaultExportName) {
    if (outputLines.length > 0) {
      outputLines.push("");
    }

    outputLines.push(`declare const _default: typeof ${defaultExportName};`);
    outputLines.push("export default _default;");
  }

  outputLines.push("");

  fs.writeFileSync(distIndexPath, outputLines.join("\n"), "utf8");
}

function writeMinimalVueDeclaration(filePath) {
  const source = [
    'import { DefineComponent } from "vue";',
    "declare const _default: DefineComponent<any, any, any, any, any>;",
    "export default _default;",
    ""
  ].join("\n");

  fs.writeFileSync(filePath, source, "utf8");
}

function rewriteProblematicVueDeclarations() {
  const relativePaths = [
    "components/dialog/src/dialog.vue.d.ts",
    "components/dialog/src/dialog.vue.js.d.ts",
    "components/popconfirm/src/popconfirm.vue.d.ts",
    "components/popconfirm/src/popconfirm.vue.js.d.ts"
  ];

  relativePaths.forEach((relativePath) => {
    const filePath = path.join(typesDir, relativePath);

    if (fs.existsSync(filePath)) {
      writeMinimalVueDeclaration(filePath);
    }
  });
}

function rewritePublicModuleIndexes() {
  const moduleRoots = [path.resolve("packages/components")];

  if (targetName === "pro") {
    moduleRoots.push(path.resolve("packages/pro-components"));
  }

  moduleRoots.forEach((moduleRoot) => {
    const typeRoot = path.join(typesDir, path.basename(moduleRoot));

    if (!fs.existsSync(typeRoot)) {
      return;
    }

    fs.readdirSync(moduleRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== "__tests__")
      .forEach((entry) => {
        const sourceIndexPath = path.join(moduleRoot, entry.name, "index.ts");
        const distIndexPath = path.join(typeRoot, entry.name, "index.d.ts");

        if (!fs.existsSync(sourceIndexPath) || !fs.existsSync(distIndexPath)) {
          return;
        }

        rewriteModuleIndexDeclaration(sourceIndexPath, distIndexPath);
      });
  });
}

for (const filePath of walkDir(typesDir)) {
  const source = fs.readFileSync(filePath, "utf8");
  let rewritten = rewriteSpecifiers(filePath, source);

  if (isPublicEntryDeclaration(filePath)) {
    rewritten = simplifyPublicEntryDeclarations(rewritten);
  }

  rewritten = simplifyVueInstanceAliases(rewritten);
  rewritten = removeUnusedVueDefaultImports(rewritten);

  if (rewritten !== source) {
    fs.writeFileSync(filePath, rewritten, "utf8");
  }

  if (filePath.endsWith(".vue.d.ts")) {
    fs.writeFileSync(filePath.replace(/\.vue\.d\.ts$/, ".vue.js.d.ts"), rewritten, "utf8");
  }
}

rewriteRootTypesEntry(path.join(typesDir, "index.d.ts"), target.entryPath);
writeCssTypes();
rewritePublicModuleIndexes();
rewriteProblematicVueDeclarations();

console.log(`已整理 ${target.packageName} 的类型产物。`);
