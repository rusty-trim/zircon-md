import { cn } from "@/lib/utils";
import { AstNode, Document } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Fragment, JSX } from "react/jsx-runtime";
import CodeBlock from "./code-block";

interface EditorProps {
  content: Document | null;
}

function Editor(props: EditorProps) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateActiveLine() {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount == 0 || !rootRef.current) return;

      let node: Node | null = sel.getRangeAt(0).startContainer;

      while (node && node != rootRef.current) {
        if (
          node instanceof HTMLElement &&
          node.dataset.line &&
          node.dataset.column
        ) {
          setActiveLine(Number(node.dataset.line));
          setActiveColumn(Number(node.dataset.column));
          return;
        }
        node = node.parentNode;
      }

      setActiveLine(null);
      setActiveColumn(null);
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
          <Fragment key={i}>
            {renderNode(node, activeLine, activeColumn)}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function renderNode(
  node: AstNode,
  activeLine: number | null,
  activeColumn: number | null,
) {
  switch (node.type) {
    case "heading": {
      const isActive = node.line == activeLine;
      const hashes = "#".repeat(node.level) + " ";

      const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;

      return (
        <HeadingTag data-line={node.line} data-column={node.column}>
          <span className="text-muted-foreground">{isActive && hashes}</span>
          {renderChildren(node, activeLine, activeColumn)}
        </HeadingTag>
      );
    }
    case "italic": {
      const active = node.line == activeLine && node.column == activeColumn;

      return (
        <i data-line={node.line} data-column={node.column}>
          {active && "*"}
          {renderChildren(node, activeLine, activeColumn)}
          {active && "*"}
        </i>
      );
    }
    case "bold": {
      const active = node.line == activeLine && node.column == activeColumn;

      return (
        <b data-line={node.line} data-column={node.column}>
          {active && "**"}
          {renderChildren(node, activeLine, activeColumn)}
          {active && "**"}
        </b>
      );
    }
    case "paragraph":
      return (
        <p data-line={node.line} className="block">
          {node.children.length == 0 ? (
            <br />
          ) : (
            renderChildren(node, activeLine, activeColumn)
          )}
        </p>
      );
    case "spoiler": {
      const active = node.line == activeLine && node.column == activeColumn;

      return (
        <span
          data-line={node.line}
          data-column={node.column}
          className={cn(
            "bg-spoiler hover:text-primary cursor-alias p-0.5 rounded-sm",
            active ? "text-primary" : "text-transparent",
          )}
        >
          {active && "||"}
          {renderChildren(node, activeLine, activeColumn)}
          {active && "||"}
        </span>
      );
    }
    case "inlineCode": {
      const active = node.line == activeLine && node.column == activeColumn;

      console.log(node.line)

      return (
        <span
          data-line={node.line}
          data-column={node.column}
          className="border-2 p-0.5 rounded-sm my-2"
        >
          {active && "`"}
          {renderChildren(node, activeLine, activeColumn)}
          {active && "`"}
        </span>
      );
    }
    case "codeBlock":
      return <CodeBlock activeLine={activeLine} {...node} />;
    case "text":
      return node.value;
  }
}

function renderChildren(
  node: AstNode & { children: AstNode[] },
  line: number | null,
  column: number | null,
) {
  return node.children.map((child, index) => (
    <Fragment key={index}>{renderNode(child, line, column)}</Fragment>
  ));
}

export { Editor };

