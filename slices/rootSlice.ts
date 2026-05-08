import { Folder, Note } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const rootSlice = createSlice({
    name: "root",
    initialState: {
        notes: {} as Record<string, Note>,
        folders: {} as Record<string, Folder>,
        noteIds: [] as string[],
        folderIds: [] as string[],
        size: 0,
    },
    reducers: {
        addNote: (state, action) => {
            const note = action.payload;
            state.notes[note.id] = note;
            state.noteIds.push(note.id);
            state.size++;
            console.log("Note Added:", note);
        },
        addFolder: (state, action) => {
            const folder = action.payload;
            state.folders[folder.id] = folder;
            state.folderIds.push(folder.id);
            console.log("Folder Added:", folder);
        },
        deleteNote: (state, action) => { },
        deleteFolder: (state, action) => { },
        updateNote: (state, action) => {
            const note = action.payload;
            state.notes[note.id] = note;
        },
        updateFolder: (state, action) => { },
    }
});

export const { addNote, addFolder, deleteNote, deleteFolder, updateNote, updateFolder } = rootSlice.actions;
export default rootSlice;