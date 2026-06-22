import { useVaultStore } from "@/stores/vault-store";
import FileEntityTree from "../file-entity";

function Sidebar() {
  const vaultPath = useVaultStore((store) => store.vaultPath);
  const files = useVaultStore((store) => store.files);

  if (vaultPath) {
    return (
      <div className="flex flex-col w-64 grow h-full">
        <div className="flex flex-col grow overflow-y-auto">
          <FileEntityTree tree={files} />
          {/* {files?.children.map((node) => (
            <FileEntityTree key={node.path} node={node} />
          ))} */}
        </div>
      </div>
    );
  } else {
    return <div className="flex-col w-64 bg-sidebar border-r"></div>;
  }
}

export { Sidebar };
