import { addNote, updateNote } from "@/slices/rootSlice";
import { selectNote } from "@/slices/selectedNoteSlice";
import { Note } from "@/types";
import { generateSnowflakeId } from "@grkndev/snowflakeid";
import { useDispatch } from "react-redux";

export function handleCreateNote(dispatch: ReturnType<typeof useDispatch>) {
    const id = generateSnowflakeId();
    const newNote: Note = {
        title: "Untitled Note",
        type: 0,
        id: id,
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    dispatch(addNote(newNote));
    dispatch(selectNote(newNote));
}

export function handleUpdateNote(note: Note, updatedFields: Partial<Note>, dispatch: ReturnType<typeof useDispatch>) {
    const updatedNote = { ...note, ...updatedFields, updatedAt: Date.now() };
    dispatch(updateNote(updatedNote)); // Reusing updateNote to update the note in the store
    dispatch(selectNote(updatedNote)); // Update the selected note with the new changes
}