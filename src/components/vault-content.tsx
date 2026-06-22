import { TabType, useTabStore } from "@/stores/tab-store";
import { NewTabView } from "./new-tab-view";
import { Editor } from "./editor";

export function VaultContent() {
  const activeTab = useTabStore((store) => store.activeTab);

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