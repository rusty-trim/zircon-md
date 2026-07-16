import { useEffect, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { CodeBlock as CodeBlockType } from "@/types";
import langConfig from "../../assets/lang-config.json";
import { cn } from "@/lib/utils";

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

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CodeBlock(props: CodeBlockType) {
  const [html, setHtml] = useState<string | null>(null);

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
    <div spellCheck="false" className="relative group my-6 rounded-lg border border-white/6 bg-[#24292e] overflow-hidden shadow-md">
      {/* Absolute positioned language tag */}
      <span
        style={{
          color: validLang ? validLang.theme : "#FFFFFF",
          backgroundColor: validLang ? hexToRgba(validLang.theme, 0.1) : hexToRgba("#FFFFFF", 0.1),
        }}
        className={cn(
          "absolute right-3 top-3 select-none rounded bg-white/[0.07] px-2 py-0.5 text-xs font-mono font-medium opacity-60 transition-opacity group-hover:opacity-100",
        )}
        spellCheck="false"
      >
        {validLang ? validLang.label : props.lang}
      </span>

      <div className="p-5 overflow-x-auto text-sm">
        {html ? (
          <div
            className="[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:whitespace-pre [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <code className="block whitespace-pre font-mono text-zinc-300">
            {props.code}
          </code>
        )}
      </div>
    </div>
  );
}
