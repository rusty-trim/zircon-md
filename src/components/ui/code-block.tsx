import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { CodeBlock as CodeBlockType } from "@/types";
import langConfig from "../../assets/lang-config.json";

const LANG_META: Record<string, { label: string; icon: string }> = {
  "javascript": { label: "JavaScript", icon: "javascript/javascript-original" },
  "js": { label: "JavaScript", icon: "javascript/javascript-original" },
  "typescript": { label: "TypeScript", icon: "typescript/typescript-original" },
  "ts": { label: "TypeScript", icon: "typescript/typescript-original" },
  "rust": { label: "Rust", icon: "rust/rust-original" },
  "rs": { label: "Rust", icon: "rust/rust-original" },
  "python": { label: "Python", icon: "python/python-original" },
  "py": { label: "Python", icon: "python/python-original" },
  "jsx": { label: "JSX", icon: "react/react-original" },
  "tsx": { label: "TSX", icon: "react/react-original" },
  "go": { label: "Go", icon: "go/go-original-wordmark" },
  "cpp": { label: "C++", icon: "cplusplus/cplusplus-original" },
  "c++": { label: "C++", icon: "cplusplus/cplusplus-original" },
  "c": { label: "C", icon: "c/c-original" },
  "css": { label: "CSS", icon: "css3/css3-original" },
  "html": { label: "HTML", icon: "html5/html5-original" },
  "bash": { label: "Bash", icon: "bash/bash-original" },
  "powershell": { label: "PowerShell", icon: "powershell/powershell-original" },
  "pwsh": { label: "PowerShell", icon: "powershell/powershell-original" },
  "json": { label: "JSON", icon: "json/json-original" },
  "xml": { label: "XML", icon: "xml/xml-original" },
};

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

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

function CodeBlockHeader({
  active,
  lang,
}: {
  active: boolean;
  lang: string;
  validLang: { theme: string; label: string };
}) {
  const key = lang.toLowerCase();
  const meta = LANG_META[key];
  const label = meta?.label ?? lang;
  const iconUrl = meta?.icon ? `${DEVICON_BASE}/${meta.icon}.svg` : null;

  return (
    <>
      {active ? (
        <div className="px-5 pt-3 text-sm font-mono text-zinc-400 select-text">
          {"```"}
          {lang ?? ""}
        </div>
      ) : (
        // <span
        //   style={{
        //     color: validLang ? validLang.theme : "#FFFFFF",
        //     backgroundColor: validLang
        //       ? hexToRgba(validLang.theme, 0.1)
        //       : hexToRgba("#FFFFFF", 0.1),
        //   }}
        //   className={cn(
        //     "absolute right-3 top-3 select-none rounded bg-white/[0.07] px-2 py-0.5 text-xs font-mono font-medium opacity-60 transition-opacity group-hover:opacity-100",
        //   )}
        //   spellCheck="false"
        // >
        //   {validLang ? validLang.label : lang}
        // </span>
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          {iconUrl ? (
            <img src={iconUrl} alt={label} className="size-4.5 shrink-0" />
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

  const validLang =
    langConfig[props.lang.toLowerCase() as keyof typeof langConfig];

  return (
    <div
      data-line={props.line}
      data-column={props.column}
      spellCheck="false"
      className="relative group my-6 rounded-lg border border-white/6 bg-[#24292e] overflow-hidden shadow-md"
    >
      <CodeBlockHeader active={active} lang={props.lang} validLang={validLang} />
      <CodeBlockContent active={active} html={html} code={props.code} />
    </div>
  );
}
