export interface Root {
    notes: Record<string, Note>;
    folders: Record<string, Folder>;

    noteIds: string[];
    folderIds: string[];
    size: number;
}

export interface Note {
    title: string;
    type: 0,
    id: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Folder {
    name: string;
    type: 1,
    id: string;
    noteIds: string[];
    folderIds: string[];
    createdAt: number;
    updatedAt: number;
}