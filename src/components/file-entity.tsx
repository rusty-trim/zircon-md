import { FileTreeNode } from "@/lib/app-storage";

export default function FileEntity({
  node,
}: {
  node: FileTreeNode;
}) {
  return (
    <div>
      {node.name}
      <div className="ml-2">
        {node.children.map((child) => (
          <FileEntity node={child} />
        ))}
      </div>
    </div>
  );
}
