import { create } from "zustand";

export enum TabType {
    NEW = 0,
    FILE = 1,
}

export interface Tab {
    id: string;
    type: TabType;
    path?: string;
    name: string;
    content: string;
    originalContent: string;
}

interface TabState {
    tabs: Tab[];
    activeTab: Tab | null;
    addTab: (tab: Tab) => void;
    addNewTab: () => void;
    removeTab: (id: string) => void;
    setTabs: (tabs: Tab[]) => void;
    ensureTab: () => void;
    setActiveTab: (tab: Tab | null) => void;
    updateContent: (id: string, content: string) => void;
    markSaved: (id: string) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
    tabs: [],
    activeTab: null!,
    addTab: (tab: Tab) => {
        set((state) => ({ tabs: [...state.tabs, tab] }));
        get().setActiveTab(tab);

    },
    addNewTab: () => {
        const tab = { id: crypto.randomUUID(), type: TabType.NEW, name: "New Tab", content: "", originalContent: "" };
        set((state) => ({ tabs: [...state.tabs, tab] }));
        get().setActiveTab(tab)

    },
    removeTab: (id) => {
        const tab = get().tabs.find((_tab) => _tab.id == id);

        if (tab) {
            const tabIdx = get().tabs.indexOf(tab);

            if (tabIdx != 0) {
                const prevTab = get().tabs[tabIdx - 1];
                get().setActiveTab(prevTab);
            }
        }

        set((state) => ({ tabs: state.tabs.filter((_tab) => _tab.id !== id) }))
    },
    setTabs: (tabs) => set({ tabs }),
    ensureTab: () => {
        if (get().tabs.length == 0) {
            get().addNewTab();
        }
    },
    setActiveTab: (tab: Tab | null) => set(() => ({ activeTab: tab })),
    findTab: (id: string) => get().tabs.find((tab) => tab.id == id),
    updateContent: (id, content) => set((state) => ({
        tabs: state.tabs.map((t) => t.id === id ? { ...t, content } : t),
    })),
    markSaved: (id) => set((state) => ({
        tabs: state.tabs.map((t) => t.id === id ? { ...t, originalContent: t.content } : t)
    }))
}))