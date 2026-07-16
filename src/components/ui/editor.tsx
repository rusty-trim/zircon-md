import { AstNode, Document } from "@/types";
import { Fragment, JSX } from "react/jsx-runtime";
import CodeBlock from "./code-block";
import { useEffect, useRef, useState } from "react";

interface EditorProps {
  content: Document | null;
}

function Editor(props: EditorProps) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateActiveLine() {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount == 0 || !rootRef.current) return;

      let node: Node | null = sel.getRangeAt(0).startContainer;

      while (node && node != rootRef.current) {
        if (node instanceof HTMLElement && node.dataset.line) {
          setActiveLine(Number(node.dataset.line));
          return;
        }
        node = node.parentNode;
      }

      setActiveLine(null);
    }

    document.addEventListener("selectionchange", updateActiveLine);

    return () =>
      document.removeEventListener("selectionchange", updateActiveLine);
  }, []);

  return (
    <div className="flex grow bg-input overflow-auto">
      <div
        ref={rootRef}
        contentEditable
        className="mx-auto w-full px-10 py-5 outline-none space-y-2"
      >
        {props.content?.children.map((node, i) => (
          <Fragment key={i}>{renderNode(node, activeLine)}</Fragment>
        ))}
      </div>
    </div>
  );
}

function renderNode(node: AstNode, activeLine: number | null) {
  switch (node.type) {
    case "heading": {
      const isActive = node.line == activeLine;
      const hashes = "#".repeat(node.level) + " ";

      const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;

      return (
        <HeadingTag data-line={node.line}>
          <span className="text-muted-foreground">{isActive && hashes}</span>
          {renderChildren(node, activeLine)}
        </HeadingTag>
      );
    }
    case "italic":
      return <i>{renderChildren(node, activeLine)}</i>;
    case "bold":
      return <b> {renderChildren(node, activeLine)}</b>;
    case "paragraph":
      return (
        <p data-line={node.line} className="block">
          {node.children.length == 0 ? (
            <br />
          ) : (
            renderChildren(node, activeLine)
          )}
        </p>
      );
    case "spoiler":
      return (
        <span className="bg-spoiler text-transparent hover:text-primary cursor-alias p-0.5 rounded-sm">
          {renderChildren(node, activeLine)}
        </span>
      );
    case "inlineCode":
      return (
        <span className="border-2 p-0.5 rounded-sm my-2">
          {renderChildren(node, activeLine)}
        </span>
      );
    case "codeBlock":
      return <CodeBlock {...node} />;
    case "text":
      return node.value;
  }
}

function renderChildren(
  node: AstNode & { children: AstNode[] },
  line: number | null,
) {
  return node.children.map((child, index) => (
    <Fragment key={index}>{renderNode(child, line)}</Fragment>
  ));
}

export { Editor };
