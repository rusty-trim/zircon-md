import { create } from "zustand";

export interface VaultState {
    vaultPath: string | null;
    setVaultPath: (path: string | null) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
    vaultPath: null,
    setVaultPath: (path: string | null) => {
        set(() => ({ vaultPath: path }))
    }
}));

export function getVaultName(vaultPath: string): string {
    if (!vaultPath) return "";

    const trimmed = vaultPath.replace(/[\\/]+$/, "");

    if (trimmed === "")
        return vaultPath;

    const segments = trimmed.split(/[\\/]/);
    const last = segments[segments.length - 1];

    if (last == "" || /^[a-zA-Z]:$/.test(last))
        return trimmed;

    return last;
}