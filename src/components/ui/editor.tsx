import { AstNode, Document } from "@/types";
import { JSX } from "react/jsx-runtime";

interface EditorProps {
  content: Document | null;
}

function Editor(props: EditorProps) {
  return (
    <div className="flex grow bg-input overflow-auto">
      <div
        contentEditable
        className="mx-auto w-full px-10 py-5 outline-none space-y-2"
      >
        {props.content?.children.map(renderNode)}
      </div>
    </div>
  );
}

function renderNode(node: AstNode) {
  switch (node.type) {
    case "heading":
      const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;
      return <HeadingTag>{node.children.map(renderNode)}</HeadingTag>;
    case "italic":
      return <i>{node.children.map(renderNode)}</i>;
    case "bold":
      return <b>{node.children.map(renderNode)}</b>;
    case "paragraph":
      return (
        <p className="block">
          {node.children.length == 0 ? <br /> : node.children.map(renderNode)}
        </p>
      );
    case "spoiler":
      return (
        <span className="bg-spoiler text-transparent hover:text-primary cursor-alias p-0.5 rounded-sm">
          {node.children.map(renderNode)}
        </span>
      );
    case "inlineCode":
      return (
        <span className="border-2 p-0.5 rounded-sm my-2">
          {node.children.map(renderNode)}
        </span>
      );
    case "text":
      return node.value;
  }
}

export { Editor };

