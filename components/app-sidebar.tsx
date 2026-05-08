import { PlusIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import { handleCreateNote } from "@/lib/note";
import { useDispatch, useSelector } from "react-redux";
import FolderView from "./folder-view";
import { Root } from "@/types";

export default function AppSidebar() {

    const dispatch = useDispatch();

    const folderIds = useSelector((state: { root: Root }) => state.root.folderIds);
    const notes = useSelector((state: { root: Root }) => state.root.notes);
    const noteIds = useSelector((state: { root: Root }) => state.root.noteIds);

    return (
        <Sidebar>
            <SidebarHeader className="flex flex-row items-center justify-between px-4 border-b">
                <h1 className="text-primary uppercase font-bold tracking-widest">Zircon</h1>
                <button className="p-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                    <PlusIcon className="w-4 h-4" />
                </button>
            </SidebarHeader>
            <SidebarContent className="p-4">
                {folderIds.map((id) => (
                    <FolderView key={id} folderId={id} />
                ))}
                {noteIds.map((id) => (
                    <button key={id} className="text-left hover:text-primary/90 hover:bg-secondary p-1 rounded-md truncate">{notes[id].title}</button>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}