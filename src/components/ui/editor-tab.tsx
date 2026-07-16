import { cn } from "@/lib/utils";
import { Tab, useTabStore } from "@/stores/tab-store";
import { XIcon } from "lucide-react";

function EditorTab(props: Tab) {
  const activeTab = useTabStore((store) => store.activeTab);
  const setActiveTab = useTabStore((store) => store.setActiveTab);
  const removeTab = useTabStore((store) => store.removeTab);
  const tabIsActive = activeTab?.id === props.id;

  return (
    <div
      className={cn(
        "text-xs h-full flex items-center justify-between gap-2 p-2 group rounded-t-md transition-all min-w-20 max-w-50 flex-1 shrink relative first:ml-5",
        tabIsActive
          ? "bg-input z-10 before:content-[''] before:absolute before:bottom-0 before:-left-2 before:w-2 before:h-2 before:[background:radial-gradient(circle_at_top_left,transparent_8px,var(--input)_0)] after:content-[''] after:absolute after:bottom-0 after:-right-2 after:w-2 after:h-2 after:[background:radial-gradient(circle_at_top_right,transparent_8px,var(--input)_0)] border border-b-transparent"
          : "hover:bg-input/90 border-b",
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
      <span className="truncate">{props.name}</span>
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