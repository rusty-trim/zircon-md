import { PlusIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import { handleCreateFolder, handleCreateNote } from "@/lib/note";
import { useDispatch, useSelector } from "react-redux";
import FolderView from "./folder-view";
import { Root } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import TreeEntry from "./tree-entry";

export default function AppSidebar() {

    const dispatch = useDispatch();

    const folderIds = useSelector((state: { root: Root }) => state.root.folderIds);
    const notes = useSelector((state: { root: Root }) => state.root.notes);
    const noteIds = useSelector((state: { root: Root }) => state.root.noteIds);

    return (
        <Sidebar>
            <SidebarHeader className="flex flex-row items-center justify-between px-4 border-b">
                <h1 className="text-primary uppercase font-bold tracking-widest">Zircon</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                            <PlusIcon className="size-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background rounded-md shadow-md p-2 w-fit">
                        <button onClick={() => handleCreateNote(dispatch)} className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                            Create Note
                        </button>
                        <button onClick={() => handleCreateFolder(dispatch)} className="w-full text-left px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                            Create Folder
                        </button>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>
            <SidebarContent className="py-4">
                <div className="h-full overflow-auto">
                    {folderIds.map((id) => (
                        <FolderView key={id} folderId={id} />
                    ))}
                    {noteIds.map((id) => (
                        <TreeEntry key={id} entry={notes[id]} level={1} />
                    ))}
                </div>
            </SidebarContent>
        </Sidebar>
    );
}