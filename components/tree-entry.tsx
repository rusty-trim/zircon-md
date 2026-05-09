import { cn } from "@/lib/utils";
import { selectNote } from "@/slices/selectedNoteSlice";
import { Folder, Note, Store } from "@/types";
import { ChevronRight, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { handleCreateFolder, handleCreateNote } from "@/lib/note";

export default function TreeEntry({ entry, children, level }: { entry: Note | Folder; children?: (Note | Folder)[]; level: number }) {
    const [expanded, setExpanded] = useState(false);
    const folders = useSelector((store: Store) => store.root.folders);
    const notes = useSelector((store: Store) => store.root.notes);
    const dispatch = useDispatch();
    const titleRef = useRef<HTMLSpanElement>(null);

    const isFolder = "noteIds" in entry;
    const Icon = isFolder ? <ChevronRight className={cn({ "rotate-90": expanded }, "size-4 text-muted-foreground transition-transform")} /> : <FileText className="size-4 text-muted-foreground" />;

    function handleClick() {
        if (isFolder) {
            setExpanded(!expanded);
        } else {
            dispatch(selectNote(entry)); // Update the selected note with the new changes
        }
    }

    return (
        <ContextMenu>
            <div className="text-left block select-none">
                <ContextMenuTrigger>
                    <span id={entry.id} style={{ paddingLeft: `${12 * level}px` }} className={cn("flex min-w-max items-center gap-2 hover:text-primary cursor-pointer hover:bg-accent transition-colors")} onClick={handleClick}>{Icon}<span className="focus:outline-none p-2 transition-colors truncate" contentEditable={false} ref={titleRef}>{entry.title}</span></span>
                </ContextMenuTrigger>
                {isFolder &&
                    (expanded && children?.map((child) => {
                        const childIsFolder = "noteIds" in child;
                        const childChildren = childIsFolder ? [...(child as Folder).folderIds.map((id) => folders[id]), ...(child as Folder).noteIds.map((id) => notes[id])] : undefined;
                        return <TreeEntry key={child.id} entry={child} children={childChildren} level={level + 1} />;
                    }))}
            </div>
            <TreeEntryContextMenuContent entry={entry} titleRef={titleRef} toggleExpand={() => setExpanded(!expanded)} expanded={expanded} />
        </ContextMenu>
    );
}

export function TreeEntryContextMenuContent({ entry, titleRef, toggleExpand, expanded }: { entry: Note | Folder, titleRef: React.RefObject<HTMLSpanElement | null>, toggleExpand?: () => void, expanded?: boolean }) {
    const dispatch = useDispatch();
    const isFolder = "noteIds" in entry;

    function handleRename() {
        titleRef.current?.setAttribute("contenteditable", "true");

        setTimeout(() => {
            titleRef.current?.classList.add("bg-accent");
            titleRef.current?.focus();
        }, 0); // Wait for the attribute to be set before focusing

        const handleBlur = () => {
            titleRef.current?.setAttribute("contenteditable", "false");
            titleRef.current?.classList.remove("bg-accent");
            titleRef.current?.removeEventListener("blur", handleBlur);
        };

        titleRef.current?.addEventListener("blur", handleBlur);
    }

    return (
        <ContextMenuContent>
            {isFolder ? (
                <>
                    <ContextMenuItem className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleCreateNote(dispatch, entry)}>
                        New Note
                    </ContextMenuItem>
                    <ContextMenuItem className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleCreateFolder(dispatch, entry)}>
                        New Folder
                    </ContextMenuItem>
                    <ContextMenuItem className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors" onClick={toggleExpand}>
                        {expanded ? "Collapse" : "Expand"} Folder
                    </ContextMenuItem>
                    <ContextMenuItem className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors" onClick={handleRename}>
                        Rename
                    </ContextMenuItem>
                </>
            ) : (
                <>
                    <ContextMenuItem className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        Rename Note
                    </ContextMenuItem>
                    <ContextMenuItem className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        Delete Note
                    </ContextMenuItem>
                </>
            )}
        </ContextMenuContent>
    );
}