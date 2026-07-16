import { loadFileContent, loadVaultFiles } from "@/lib/app-storage";
import { TabType, useTabStore } from "@/stores/tab-store";
import { useVaultStore } from "@/stores/vault-store";
import { useEffect, useState } from "react";
import { NewTabView } from "./new-tab-view";
import { Editor } from "./ui/editor";
import { Document } from "@/types";

export function VaultContent() {
  const activeTab = useTabStore((store) => store.activeTab);
  const [content, setContent] = useState<Document | null>(null);

  useEffect(() => {
    loadVaultFiles(useVaultStore.getState().vaultPath!).then((files) => {
      useVaultStore.getState().setFiles(files);
    });
  }, []);

  useEffect(() => {
    if (activeTab?.path) {
      loadFileContent(activeTab.path).then((fileContent) => {
        setContent(fileContent);
      });
    }
  }, [activeTab]);

  return (
    <>
      {activeTab &&
        (() => {
          switch (activeTab.type) {
            case TabType.NEW:
              return <NewTabView />;
            case TabType.FILE:
              return <Editor content={content} />;
            default:
              return null;
          }
        })()}
    </>
  );
}
