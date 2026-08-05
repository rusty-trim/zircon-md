import { JSX, SVGProps, useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { CodeBlock as CodeBlockType } from "@/types";
import {
  AwkIcon,
  BashIcon,
  CIcon,
  CMakeIcon,
  CPlusPlusIcon,
  CSharpIcon,
  CSS3Icon,
  GoIcon,
  HaskellIcon,
  HTML5Icon,
  JavaIcon,
  JavaScriptIcon,
  JSONIcon,
  LuaIcon,
  MarkdownIcon,
  PerlIcon,
  PHPIcon,
  PowerShellIcon,
  PythonIcon,
  ReactIcon,
  RIcon,
  RubyIcon,
  RustIcon,
  SQLIcon,
  TypeScriptIcon,
  XMLIcon,
} from "../icons";

const LANG_META: Record<
  string,
  { label: string; icon: (props: SVGProps<SVGSVGElement>) => JSX.Element }
> = {
  awk: { label: "AWK", icon: AwkIcon },
  bash: { label: "Bash", icon: BashIcon },
  c: { label: "C", icon: CIcon },
  cpp: { label: "C++", icon: CPlusPlusIcon },
  "c++": { label: "C++", icon: CPlusPlusIcon },
  cmake: { label: "CMake", icon: CMakeIcon },
  csharp: { label: "C#", icon: CSharpIcon },
  cs: { label: "C#", icon: CSharpIcon },
  "c#": { label: "C#", icon: CSharpIcon },
  css: { label: "CSS", icon: CSS3Icon },
  haskell: { label: "Haskell", icon: HaskellIcon },
  hs: { label: "Haskell", icon: HaskellIcon },
  java: { label: "Java", icon: JavaIcon },
  javascript: { label: "JavaScript", icon: JavaScriptIcon },
  js: { label: "JavaScript", icon: JavaScriptIcon },
  cjs: { label: "JavaScript", icon: JavaScriptIcon },
  mjs: { label: "JavaScript", icon: JavaScriptIcon },
  jsx: { label: "JSX", icon: ReactIcon },
  json: { label: "JSON", icon: JSONIcon },
  lua: { label: "Lua", icon: LuaIcon },
  markdown: { label: "Markdown", icon: MarkdownIcon },
  md: { label: "Markdown", icon: MarkdownIcon },
  perl: { label: "Perl", icon: PerlIcon },
  php: { label: "PHP", icon: PHPIcon },
  powershell: { label: "PowerShell", icon: PowerShellIcon },
  ps: { label: "PowerShell", icon: PowerShellIcon },
  ps1: { label: "PowerShell", icon: PowerShellIcon },
  pwsh: { label: "PowerShell", icon: PowerShellIcon },
  python: { label: "Python", icon: PythonIcon },
  py: { label: "Python", icon: PythonIcon },
  r: { label: "R", icon: RIcon },
  ruby: { label: "Ruby", icon: RubyIcon },
  rb: { label: "Ruby", icon: RubyIcon },
  rust: { label: "Rust", icon: RustIcon },
  rs: { label: "Rust", icon: RustIcon },
  sql: { label: "SQL", icon: SQLIcon },
  tsx: { label: "TSX", icon: ReactIcon },
  typescript: { label: "TypeScript", icon: TypeScriptIcon },
  ts: { label: "TypeScript", icon: TypeScriptIcon },
  go: { label: "Go", icon: GoIcon },
  html: { label: "HTML", icon: HTML5Icon },
  xml: { label: "XML", icon: XMLIcon },
};

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [],
    });
  }
  return highlighterPromise;
}

function CodeBlockHeader({ active, lang }: { active: boolean; lang: string }) {
  const key = lang.toLowerCase();
  const meta = LANG_META[key];
  const label = meta?.label ?? lang;
  const Icon = meta.icon;

  return (
    <>
      {active ? (
        <div className="px-5 pt-3 text-sm font-mono text-zinc-400 select-text">
          {"```"}
          {lang ?? ""}
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          {meta ? (
            <Icon className="size-4.5 shrink-0 text-accent-foreground" />
          ) : (
            <span></span>
          )}
          <span>{label}</span>
        </div>
      )}
    </>
  );
}

function CodeBlockContent({
  active,
  html,
  code,
}: {
  active: boolean;
  html: string | null;
  code: string;
}) {
  return (
    <>
      <div className="p-5 overflow-x-auto text-sm">
        {html ? (
          <div
            className="[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:whitespace-pre [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <code className="block whitespace-pre font-mono text-zinc-300">
            {code}
          </code>
        )}
      </div>

      {active && (
        <div className="px-5 pb-3 text-sm font-mono text-zinc-400 select-text">
          {"```"}
        </div>
      )}
    </>
  );
}

export default function CodeBlock(
  props: CodeBlockType & {
    activeLine: number | null;
  },
) {
  const [html, setHtml] = useState<string | null>(null);
  const active =
    props.activeLine !== null &&
    props.activeLine >= props.line &&
    props.activeLine <= props.endLine;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const highlighter = await getHighlighter();
      const lang = props.lang ?? "text";

      if (!highlighter.getLoadedLanguages().includes(lang)) {
        try {
          await highlighter.loadLanguage(lang as any);
        } catch {
          // unsupported language id — fall back below
        }
      }

      const finalLang = highlighter.getLoadedLanguages().includes(lang)
        ? lang
        : "text";
      const rendered = highlighter.codeToHtml(props.code, {
        lang: finalLang,
        theme: "github-dark",
      });

      if (!cancelled) setHtml(rendered);
    })();

    return () => {
      cancelled = true;
    };
  }, [props.code, props.lang]);

  return (
    <div
      data-line={props.line}
      data-column={props.column}
      spellCheck="false"
      className="relative group my-6 rounded-lg border border-white/6 bg-[#24292e] overflow-hidden shadow-md"
    >
      <CodeBlockHeader active={active} lang={props.lang} />
      <CodeBlockContent active={active} html={html} code={props.code} />
    </div>
  );
}
