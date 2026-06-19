import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from "./ui/button";

function NewTabView() {
  const appWindow = getCurrentWindow();

  return (
    <div className="grid grid-cols-1 place-items-center w-full bg-input">
      <div className="flex flex-col gap-y-4">
        <Button variant={"link"} size={"lg"}>
          Create a new note (Ctrl + N)
        </Button>
        <Button variant={"link"} size={"lg"}>
          Go to file (Ctrl + O)
        </Button>
        <Button variant={"link"} size={"lg"} onClick={() => appWindow.close()}>
          Close
        </Button>
      </div>
    </div>
  );
}

export { NewTabView };

