import { FileTree, FileTreeNode } from "@/lib/app-storage";
import { ComponentPropsWithoutRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { TabType, useTabStore } from "@/stores/tab-store";

interface FileEntityProps extends ComponentPropsWithoutRef<"div"> {
  node: FileTreeNode;
  depth: number;
}

function FileItem(props: FileEntityProps) {
  function openTab() {
    const tab = {
      id: crypto.randomUUID(),
      type: TabType.FILE,
      name: props.node.name.replace(/\.md$/i, ""),
      path: props.node.path,
    };
    useTabStore.getState().addTab(tab);
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          "my-2 flex items-center text-xs cursor-pointer hover:bg-input/90 h-8",
          props.className,
        )}
        style={{ paddingLeft: `${props.depth * 8}px` }}
        onClick={() => openTab()}
      >
        {props.node.name.replace(/\.md$/i, "")}
      </div>
    </div>
  );
}

function FolderItem(props: FileEntityProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="select-none">
      <div
        className={cn(
          "py-2 flex items-center text-xs cursor-pointer hover:bg-input/90 h-8",
          props.className,
        )}
        style={{ paddingLeft: `${props.depth * 8}px` }}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="mr-2">
          <ChevronDown
            className={cn(
              isOpen ? "rotate-0" : "-rotate-90",
              "transition-transform",
            )}
            size={16}
          />
        </span>
        {props.node.name}
      </div>
      {isOpen &&
        props.node.children.map((child) =>
          child.isDir ? (
            <FolderItem key={child.path} node={child} depth={props.depth + 1} />
          ) : (
            <FileItem key={child.path} node={child} depth={props.depth + 1} />
          ),
        )}
    </div>
  );
}

export default function FileEntityTree({ tree }: { tree: FileTree | null }) {
  return (
    <>
      {tree?.children.map((node) =>
        node.isDir ? (
          <FolderItem key={node.path} node={node} depth={1} />
        ) : (
          <FileItem key={node.path} node={node} depth={1} />
        ),
      )}
    </>
  );
}
