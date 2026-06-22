import { useTabStore } from "@/stores/tab-store";
import { useVaultStore } from "@/stores/vault-store";
import { saveSession, Session } from "./app-storage";

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function assembleSession(): Session {
    const { tabs, activeTab } = useTabStore.getState();
    const { vaultPath } = useVaultStore.getState();

    return {
        vaultPath,
        tabs,
        activeTabId: activeTab?.id ?? null
    }
}

function scheduleSave() {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {
        saveSession(assembleSession()).catch((err) => console.error("Failed to save session:", err));
    }, 500);
}

export async function flushSaveNow(): Promise<void> {
    if (saveTimeout) clearTimeout(saveTimeout);

    return saveSession(assembleSession()).catch((err) => console.error("Failed to save session:", err));
}

export function initSessionSync(): void {
    useTabStore.subscribe(scheduleSave);
    useVaultStore.subscribe(scheduleSave);
}