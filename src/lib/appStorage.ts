import { invoke } from "@tauri-apps/api/core";

interface Settings {
    theme: "light" | "dark" | "system";
}

interface Session {
    tabs: { id: string; path: string, name: string; }[];
    vaultPath: string | null;
    vault: string | null;
    activeTabId: string | null;
}

export const loadSettings = () => invoke<Settings>("load_settings");
export const loadSession = () => invoke<Session>("load_session");