import { JsxEmit, ModuleKind, ScriptTarget, transpileModule } from "typescript";

export function sfcTs2js(content: string) {
  const scriptReg = /<script([\s\S]*?)lang="(ts|tsx)"([\s\S]*?)>([\s\S]*?)<\/script>/;
  const matched = content.match(scriptReg);

  if (!matched || matched.index === undefined) {
    return content;
  }

  const lang = matched[2];
  const attrsBefore = matched[1].replace(/\s+$/, "");
  const attrsAfter = matched[3].replace(/\s+$/, "");
  const script = matched[4];
  const header = content.slice(0, matched.index);
  const footer = content.slice(matched.index + matched[0].length);
  const jsLangAttr = lang === "tsx" ? ' lang="jsx"' : "";
  const attrs = `${attrsBefore}${attrsAfter}`.replace(/\s+/g, " ").trim();
  const normalizedAttrs = attrs
    .replace(/\blang="(ts|tsx)"/, "")
    .replace(/\s+/g, " ")
    .trim();
  const openTag = `<script${normalizedAttrs ? ` ${normalizedAttrs}` : ""}${jsLangAttr}>`;

  return `${header}${openTag}\n${ts2Js(script)}\n</script>${footer}`;
}

function ts2Js(content: string) {
  const beforeTransformContent = content.replace(/\n(\s)*\n/g, "\n// blankline\n");
  const result = transpileModule(beforeTransformContent, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      verbatimModuleSyntax: true,
      jsx: JsxEmit.Preserve
    }
  });

  return result.outputText
    .trim()
    .replace(/(\/\/ blankline(\n)?)+/g, "\n")
    .replace(/\nexport\s*\{\s*\};?\s*$/g, "")
    .trim();
}
