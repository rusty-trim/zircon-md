import { useTabStore } from "@/stores/tab-store";
import { useVaultStore } from "@/stores/vault-store";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { MinusIcon, PlusIcon, SquareIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { EditorTab } from "./ui/editor-tab";

function TitleBar() {
  const vaultPath = useVaultStore((store) => store.vaultPath);
  const tabs = useTabStore((store) => store.tabs);
  const ensureTab = useTabStore((store) => store.ensureTab);
  const addNewTab = useTabStore((store) => store.addNewTab);

  const appWindow = getCurrentWindow();

  useEffect(() => {
    if (vaultPath) ensureTab();
  }, [tabs, ensureTab, vaultPath]);

  function handleMinimize() {
    appWindow.minimize();
  }

  function handleMaximize() {
    appWindow.toggleMaximize();
  }

  function handleClose() {
    appWindow.close();
  }

  return (
    <div
      data-tauri-drag-region
      className="flex items-center h-fit w-full select-none bg-sidebar"
    >
      <div
        data-tauri-drag-region
        className="flex w-64 h-full bg-sidebar items-center text-ellipsis text-nowrap overflow-hidden"
      >
        {vaultPath && (
          <div data-tauri-drag-region className="flex items-center mx-2 gap-4">
            <button className="text-xs text-muted-foreground p-1 hover:bg-input/90 rounded-sm">
              File
            </button>
            <button className="text-xs text-muted-foreground p-1 hover:bg-input/90 rounded-sm">
              Edit
            </button>
            <button className="text-xs text-muted-foreground p-1 hover:bg-input/90 rounded-sm">
              View
            </button>
            <button className="text-xs text-muted-foreground p-1 hover:bg-input/90 rounded-sm">
              Help
            </button>
          </div>
        )}
      </div>

      <div
        data-tauri-drag-region
        className="flex-1 min-w-0 flex items-center h-full overflow-hidden gap-2"
      >
        <div
          data-tauri-drag-region
          className="flex min-w-0 flex-1 items-center h-full"
        >
          {vaultPath && tabs.map((tab) => <EditorTab {...tab} key={tab.id} />)}
          {vaultPath && (
            <button
              className="ml-0.5 h-full aspect-square p-0.5"
              onClick={() => addNewTab()}
            >
              <div className="hover:bg-input/90 w-full h-full flex justify-center items-center rounded-md">
                <PlusIcon size={16} />
              </div>
            </button>
          )}
        </div>
      </div>
      <div data-tauri-drag-region className="flex shrink-0 items-center">
        <button
          className="p-3 hover:bg-muted transition-colors"
          onClick={handleMinimize}
        >
          <MinusIcon size={16} />
        </button>
        <button
          className="p-3 hover:bg-muted transition-colors"
          onClick={handleMaximize}
        >
          <SquareIcon size={16} />
        </button>
        <button
          className="p-3 hover:bg-destructive transition-colors"
          onClick={handleClose}
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
}

export { TitleBar };
