// lib/shiki.ts
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter(lang: string) {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [], // load languages on demand below
    });
  }
  const highlighter = await highlighterPromise;

  if (!highlighter.getLoadedLanguages().includes(lang)) {
    try {
      await highlighter.loadLanguage(lang as any);
    } catch {
      // unknown language id — fall back to plain text
      return { highlighter, lang: "text" };
    }
  }

  return { highlighter, lang };
}