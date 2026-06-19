import { useTabStore } from "@/stores/tabStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { MinusIcon, PlusIcon, SquareIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { EditorTab } from "./ui/editor-tab";

function TitleBar() {
  const tabStore = useTabStore();
  const appWindow = getCurrentWindow();

  useEffect(() => {
    tabStore.ensureTab();
  }, [tabStore.tabs]);

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
        <div className="flex items-center mx-2 gap-4">
          <button className="text-xs text-muted-foreground p-1 hover:bg-muted rounded-sm">
            File
          </button>
          <button className="text-xs text-muted-foreground p-1 hover:bg-muted rounded-sm">
            Edit
          </button>
          <button className="text-xs text-muted-foreground p-1 hover:bg-muted rounded-sm">
            View
          </button>
          <button className="text-xs text-muted-foreground p-1 hover:bg-muted rounded-sm">
            Help
          </button>
        </div>
      </div>
      <div
        data-tauri-drag-region
        className="flex grow items-center h-full overflow-x-auto shrink-0"
      >
        {/* rusty_tuff_asl.txt */}
        {tabStore.tabs.map((tab) => (
          <EditorTab {...tab} key={tab.id} />
        ))}
        <button
          className="p-3 hover:bg-muted transition-colors"
          onClick={() => tabStore.addNewTab()}
        >
          <PlusIcon size={16} />
        </button>
      </div>
      <div data-tauri-drag-region className="flex items-center">
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

