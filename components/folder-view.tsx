import { Root } from "@/types";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function FolderView({ folderId }: { folderId: string }) {
    const [expanded, setExpanded] = useState(false);
    const folder = useSelector((state: Root) => state.folders[folderId]);
    const notes = useSelector((state: Root) => state.notes);

    return (
        <div>
            <button className="text-left hover:text-primary/90 hover:bg-secondary p-1 rounded-md transition-colors" onClick={() => setExpanded(!expanded)}>
                {folder.name}
            </button>

            {folder.folderIds.map((subFolderId) => (
                <FolderView key={subFolderId} folderId={subFolderId} />
            ))}

            {expanded && folder.noteIds.map((noteId) => (
                <button key={noteId} className="text-left hover:text-primary/90 hover:bg-secondary p-1 rounded-md transition-colors">
                    {notes[noteId].title}
                </button>
            ))}
        </div>
    );
}