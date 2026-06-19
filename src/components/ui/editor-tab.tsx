import { cn } from "@/lib/utils";
import { Tab, useTabStore } from "@/stores/tabStore";
import { XIcon } from "lucide-react";

function EditorTab(props: Tab) {
  const tabStore = useTabStore();
  const tabIsActive = tabStore.activeTab.id === props.id;

  return (
    <div
      className={cn(
        "text-xs h-full flex items-center hover:bg-muted gap-2 p-2 group rounded-t-md transition-colors",
        tabIsActive ? "bg-input" : "",
      )}
      onClick={() => {
        tabStore.setActiveTab(props);
      }}
      onAuxClick={(event) => {
        if (event.button == 1) {
          event.preventDefault();
          tabStore.removeTab(props.id);
        }
      }}
    >
      <span className="">{props.name}</span>
      <button
        onClick={(event) => {
          event.stopPropagation();
          tabStore.removeTab(props.id);
        }}
      >
        <XIcon
          className="text-transparent group-hover:text-muted-foreground hover:text-destructive"
          size={12}
        />
      </button>
    </div>
  );
}

export { EditorTab };
