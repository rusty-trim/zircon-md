import { useVaultStore } from "@/stores/vault-store";
import { open } from "@tauri-apps/plugin-dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function VaultSetup() {
  async function handleOpenVault() {
    const path = await open({
      directory: true,
      multiple: false,
      title: "Select Vault Folder",
    });

    if (!path) return;
    useVaultStore.getState().setVaultPath(path);
  }

  return (
    <div className="flex grow">
      <Card className="m-auto container max-w-md lg:max-w-lg xl:max-w-xl">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Create a new vault</CardTitle>
            <CardDescription>
              Create a new Zircon vault under a folder.
            </CardDescription>
          </div>
          <Button className="w-16 lg:w-32">Create</Button>
        </CardHeader>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Open folder as vault</CardTitle>
            <CardDescription>
              Choose an existing folder of markdown files.
            </CardDescription>
          </div>
          <Button
            className="w-16 lg:w-32"
            variant={"secondary"}
            onClick={handleOpenVault}
          >
            Open
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}