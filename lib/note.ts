import { addFolder, addNote, updateNote } from "@/slices/rootSlice";
import { selectNote } from "@/slices/selectedNoteSlice";
import { Folder, Note } from "@/types";
import { generateSnowflakeId } from "@grkndev/snowflakeid";
import { useDispatch } from "react-redux";

export function handleCreateNote(dispatch: ReturnType<typeof useDispatch>, folder?: Folder) {
    const id = generateSnowflakeId();
    const newNote: Note = {
        title: "Untitled Note",
        id: id,
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    dispatch(addNote({ note: newNote, folder: folder }));
    dispatch(selectNote(newNote));
}

export function handleCreateFolder(dispatch: ReturnType<typeof useDispatch>, parentFolder?: Folder) {
    const id = generateSnowflakeId();
    const newFolder: Folder = {
        title: "Untitled Folder",
        id: id,
        noteIds: [],
        folderIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    dispatch(addFolder({ folder: newFolder, parentFolder: parentFolder }));
}

export function handleUpdateNote(note: Note, updatedFields: Partial<Note>, dispatch: ReturnType<typeof useDispatch>) {
    const updatedNote = { ...note, ...updatedFields, updatedAt: Date.now() };
    dispatch(updateNote(updatedNote)); // Reusing updateNote to update the note in the store
    dispatch(selectNote(updatedNote)); // Update the selected note with the new changes
}