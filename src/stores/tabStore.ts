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
}

interface TabState {
    tabs: Tab[];
    activeTab: string;
    addTab: (tab: Tab) => void;
    addNewTab: () => void;
    removeTab: (id: string) => void;
    setTabs: (tabs: Tab[]) => void;
    ensureTab: () => void;
    setActiveTab: (id: string) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
    tabs: [],
    activeTab: "",
    addTab: (tab: Tab) => {
        set((state) => ({ tabs: [...state.tabs, tab] }));
        get().setActiveTab(tab.id);

    },
    addNewTab: () => {
        const id = crypto.randomUUID();
        set((state) => ({ tabs: [...state.tabs, { id: id, type: TabType.NEW, name: "New Tab" }] }));
        get().setActiveTab(id)
    },
    removeTab: (id) => {
        const tab = get().tabs.find((_tab) => _tab.id == id);

        if (tab) {
            const tabIdx = get().tabs.indexOf(tab);

            if (tabIdx != 0) {
                const prevTab = get().tabs[tabIdx - 1];
                get().setActiveTab(prevTab.id);
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
    setActiveTab: (id: string) => set(() => ({ activeTab: id }))
}))