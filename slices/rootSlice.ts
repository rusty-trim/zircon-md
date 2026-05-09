import { Folder, FolderPayload, Note, NotePayload, Root } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const rootSlice = createSlice({
    name: "root",
    initialState: {
        notes: {} as Record<string, Note>,
        folders: {} as Record<string, Folder>,
        noteIds: [] as string[],
        folderIds: [] as string[],
        size: 0,
    } as Root,
    reducers: {
        addNote: (state, action) => {
            const payload: NotePayload = action.payload;
            const note = payload.note;

            if (payload.folder) {
                if (state.folders[payload.folder.id]) {
                    state.folders[payload.folder.id].noteIds.push(note.id);
                    state.folders[payload.folder.id].updatedAt = Date.now();
                } else {
                    console.warn("Folder not found for note:", payload.folder.id);
                    return;
                }
            } else {
                state.noteIds.push(note.id);
            }

            state.notes[note.id] = note;
            state.size++;
            console.log("Note Added:", note);
        },
        addFolder: (state, action) => {
            const payload: FolderPayload = action.payload;
            const folder = payload.folder;

            if (payload.parentFolder) {
                if (state.folders[payload.parentFolder.id]) {
                    state.folders[payload.parentFolder.id].folderIds.push(folder.id);
                    state.folders[payload.parentFolder.id].updatedAt = Date.now();
                } else {
                    console.warn("Parent folder not found for folder:", payload.parentFolder.id);
                    return;
                }
            } else {
                state.folderIds.push(folder.id);
            }

            state.folders[folder.id] = folder;
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