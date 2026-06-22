import { TabType, useTabStore } from "@/stores/tab-store";
import { NewTabView } from "./new-tab-view";
import { Editor } from "./editor";
import { useEffect } from "react";
import { loadVaultFiles } from "@/lib/app-storage";
import { useVaultStore } from "@/stores/vault-store";

export function VaultContent() {
  const activeTab = useTabStore((store) => store.activeTab);

  useEffect(() => {
    loadVaultFiles(useVaultStore.getState().vaultPath!).then((files) => {
      useVaultStore.getState().setFiles(files);
    });
  }, []);

  return (
    <>
      {activeTab &&
        (() => {
          switch (activeTab.type) {
            case TabType.NEW:
              return <NewTabView />;
            case TabType.FILE:
              return <Editor />;
            default:
              return null;
          }
        })()}
    </>
  );
}
