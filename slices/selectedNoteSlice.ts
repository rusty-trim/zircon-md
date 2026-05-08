import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "selectedNote",
    initialState: null,
    reducers: {
        selectNote: (state, action) => action.payload,
        deselectNote: () => null
    }
});

export const { selectNote, deselectNote } = slice.actions;
export default slice;