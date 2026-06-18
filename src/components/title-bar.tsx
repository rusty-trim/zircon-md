import { getCurrentWindow } from "@tauri-apps/api/window";
import { MinusIcon, SquareIcon, XIcon } from "lucide-react";

function TitleBar() {
  const appWindow = getCurrentWindow();

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
    <div data-tauri-drag-region className="flex items-center h-fit w-full border-b">
      <div className="flex w-64 h-full bg-sidebar border-r items-center text-ellipsis text-nowrap overflow-hidden">
        Folder Name goes here...
      </div>
      <div className="flex grow items-center">
        Tab Area Goes Here...
      </div>
      <div className="flex items-center">
        <button className="p-3 hover:bg-muted" onClick={handleMinimize}>
          <MinusIcon size={16} />
        </button>
        <button className="p-3 hover:bg-muted" onClick={handleMaximize}>
          <SquareIcon size={16} />
        </button>
        <button className="p-3 hover:bg-destructive" onClick={handleClose}>
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
}

export { TitleBar };
