import { cn } from "@/lib/utils";
import { Tab, useTabStore } from "@/stores/tabStore";
import { XIcon } from "lucide-react";

function EditorTab(props: Tab) {
  const { activeTab, setActiveTab, removeTab } = useTabStore((store) => ({
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    removeTab: store.removeTab,
  }));
  const tabIsActive = activeTab.id === props.id;

  return (
    <div
      className={cn(
        "text-xs h-full flex items-center justify-between hover:bg-input/90 gap-2 p-2 group rounded-t-md transition-all min-w-20 max-w-50 truncate flex-1 shrink overflow-hidden",
        tabIsActive ? "bg-input" : "",
      )}
      onClick={() => {
        setActiveTab(props);
      }}
      onAuxClick={(event) => {
        if (event.button == 1) {
          event.preventDefault();
          removeTab(props.id);
        }
      }}
    >
      <span className="">{props.name}</span>
      <button
        onClick={(event) => {
          event.stopPropagation();
          removeTab(props.id);
        }}
      >
        <XIcon
          className="text-transparent group-hover:text-muted-foreground hover:text-destructive transition-colors"
          size={12}
        />
      </button>
    </div>
  );
}

export { EditorTab };
