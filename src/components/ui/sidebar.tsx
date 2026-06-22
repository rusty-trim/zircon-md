import { useVaultStore } from "@/stores/vault-store";
import FileEntity from "../file-entity";

function Sidebar() {
  const vaultPath = useVaultStore((store) => store.vaultPath);
  const files = useVaultStore((store) => store.files);

  if (vaultPath) {
    return (
      <div className="flex-col w-64 bg-sidebar border-r">
        {files?.children.map((node) => (
          <FileEntity key={node.path} node={node} children={node.children} />
        ))}
      </div>
    );
  } else {
    return <div className="flex-col w-64 bg-sidebar border-r"></div>;
  }
}

export { Sidebar };
