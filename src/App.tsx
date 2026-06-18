import { invoke } from "@tauri-apps/api/core";
import { ThemeProvider } from "./components/theme-provider";
import { TitleBar } from "./components/title-bar";
import { Sidebar } from "./components/ui/sidebar";

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col w-full h-full">
        <TitleBar />
        <div className="flex grow">
          <Sidebar />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
