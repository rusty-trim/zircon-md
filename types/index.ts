export interface Root {
    notes: Record<string, Note>;
    folders: Record<string, Folder>;

    noteIds: string[];
    folderIds: string[];
    size: number;
}

export interface Note {
    title: string;
    id: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Folder {
    title: string;
    id: string;
    noteIds: string[];
    folderIds: string[];
    createdAt: number;
    updatedAt: number;
}

export interface Store {
    root: Root;
    selectedNote: Note | null;    
}

export interface NotePayload {
    note: Note;
    folder?: Folder;
}

export interface FolderPayload {
    folder: Folder;
    parentFolder?: Folder;
}