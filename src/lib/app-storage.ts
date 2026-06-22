import { Tab } from "@/stores/tab-store";
import { invoke } from "@tauri-apps/api/core";

interface Settings {
    theme: "light" | "dark" | "system";
}

export interface Session {
    tabs: Tab[];
    vaultPath: string | null;
    activeTabId: string | null;
}

export interface FileTree {
    children: FileTreeNode[];
}

export interface FileTreeNode {
    isDir: boolean;
    name: string;
    path: string;
    children: FileTreeNode[]
}

export const loadSettings = async () => invoke<Settings>("load_settings");
export const saveSettings = async (settings: Settings) => invoke<void>("save_settings", { settings });
export const loadSession = async () => invoke<Session>("load_session");
export const saveSession = async (session: Session) => invoke<void>("save_session", { session });
export const loadVaultFiles = async (vaultPath: string) => invoke<FileTree>("load_vault_files", { vaultPath })