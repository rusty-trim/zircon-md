import { ThemeProvider } from "@/components/theme-provider";
import { TitleBar } from "@/components/title-bar";
import { Sidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { VaultContent } from "./components/vault-content";
import { VaultSetup } from "./components/vault-setup";
import { loadSession } from "./lib/app-storage";
import { initSessionSync } from "./lib/session-sync";
import { useTabStore } from "./stores/tab-store";
import { useVaultStore } from "./stores/vault-store";

function App() {
  const vaultPath = useVaultStore((store) => store.vaultPath);

  useEffect(() => {
    loadSession().then((session) => {
      const tabStore = useTabStore.getState();
      const vaultStore = useVaultStore.getState();
      tabStore.setTabs(session.tabs);
      tabStore.setActiveTab(
        session.tabs.find((tab) => tab.id === session.activeTabId) ?? null
      );
      vaultStore.setVaultPath(session.vaultPath);
      initSessionSync();
    }).catch((err) => console.error(err));
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="grainy flex flex-col w-full h-full">
        <TitleBar />
        <div className="flex grow">
          <Sidebar />
          {vaultPath ? <VaultContent /> : <VaultSetup />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
