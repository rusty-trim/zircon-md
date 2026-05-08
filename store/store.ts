import rootSlice from "@/slices/rootSlice";
import selectedNoteSlice from "@/slices/selectedNoteSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        root: rootSlice.reducer,
        selectedNote: selectedNoteSlice.reducer
    }
});

export default store;