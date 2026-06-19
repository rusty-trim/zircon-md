import { NewTabView } from "./components/new-tab-view";
import { ThemeProvider } from "./components/theme-provider";
import { TitleBar } from "./components/title-bar";
import { Editor } from "./components/ui/editor";
import { Sidebar } from "./components/ui/sidebar";
import { TabType, useTabStore } from "./stores/tabStore";

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const tabStore = useTabStore();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="grainy flex flex-col w-full h-full">
        <TitleBar />
        <div className="flex grow">
          <Sidebar />
          {tabStore.activeTab && (() => {
            switch (tabStore.activeTab.type) {
              case TabType.NEW:
                return <NewTabView />;
              case TabType.FILE:
                return <Editor />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
