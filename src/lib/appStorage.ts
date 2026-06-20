import {
    BaseDirectory,
    exists,
    mkdir,
    rename,
    writeTextFile,
} from "@tauri-apps/plugin-fs";

const SETTINGS_FILE = "settings.json";
const SESSION_FILE = "session.json";

interface Settings {
    theme: "light" | "dark" | "system";
}

interface Session {
    tabs: { id: string; path: string, name: string; }[];
    vaultPath: string | null;
    vault: string | null;
    activeTabId: string | null;
}

const DEFAULT_SETTINGS: Settings = {
    theme: "system"
}

const DEFAULT_SESSION: Session = {
    vaultPath: null,
    vault: null,
    tabs: [],
    activeTabId: null
}

export async function initAppStorage(): Promise<void> {
    await mkdir("", { baseDir: BaseDirectory.AppLocalData, recursive: true });

    if (!(await exists(SETTINGS_FILE, { baseDir: BaseDirectory.AppLocalData }))) {
        await atomicWriteJson(SETTINGS_FILE, DEFAULT_SETTINGS);
    }

    if (!(await exists(SESSION_FILE, { baseDir: BaseDirectory.AppLocalData }))) {
        await atomicWriteJson(SESSION_FILE, DEFAULT_SESSION);
    }
}

/**
 * Write to a temp file and then rename it so that when a crash occurs mid-write, we never leave a corrupted file.
 */
async function atomicWriteJson(filename: string, data: unknown): Promise<void> {
    const tempFilename = `${filename}.tmp`;
    const json = JSON.stringify(data, null, 2);

    await writeTextFile(tempFilename, json, { baseDir: BaseDirectory.AppLocalData });
    await rename(tempFilename, filename, { oldPathBaseDir: BaseDirectory.AppLocalData, newPathBaseDir: BaseDirectory.AppLocalData });
}