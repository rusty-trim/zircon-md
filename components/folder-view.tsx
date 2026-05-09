import { Root, Store } from "@/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import TreeEntry from "./tree-entry";

export default function FolderView({ folderId }: { folderId: string }) {
    const folders = useSelector((store: Store) => store.root.folders);
    const folder = useSelector((store: Store) => store.root.folders[folderId]);
    const notes = useSelector((store: Store) => store.root.notes);

    return (
        <>
            <TreeEntry entry={folder} level={1} children={[...folder.folderIds.map((id) => folders[id]), ...folder.noteIds.map((id) => notes[id])]} />
        </>
    );
}