"use client"
import AppSidebar from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { handleCreateNote, handleUpdateNote } from "@/lib/note"
import { Note, Root } from "@/types"
import { FileText, Plus } from "lucide-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Page() {
  const dispatch = useDispatch();
  const root: Root = useSelector((state: { root: Root }) => state.root);
  const selectedNote = useSelector((state: { selectedNote: Note | null }) => state.selectedNote);

  useEffect(() => {
    console.log("Selected Note:", selectedNote);
  }, [selectedNote]);

  useEffect(() => {
    console.log("Root State:", root);
  }, [root]);

  function handleInput(event: React.KeyboardEvent<HTMLDivElement>) {
    if (selectedNote == null) return;

    if (event.key === "Enter") {
      event?.preventDefault();
      const newBlock = document.createElement("div");
      newBlock.className = "block";
      newBlock.innerHTML = "<br>"; // Add a line break for the new block
      event.currentTarget.appendChild(newBlock);

      // Move the cursor to the new block
      const range = document.createRange();
      range.setStart(newBlock, 0);
      range.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else if (event.key === "Backspace") {
      // TODO: Handle backspace to delete blocks and update note content accordingly
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 h-full bg-foreground/10">
          {selectedNote == null ? (
            // No note selected
            <div className="flex h-full justify-center items-center">
              <div className="flex flex-col items-center">
                <FileText className="w-24 h-24 bg-primary/10 text-primary p-4 rounded-full" />
                <h2 className="text-3xl lg:text-4xl mt-4">No Note Selected</h2>
                <p className="text-muted-foreground text-center">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <Button size={"lg"} className="mt-4" onClick={() => handleCreateNote(dispatch)}>
                  <Plus /> Create Note
                </Button>
              </div>
            </div>
          ) : (
            // Note Editor
            <div className="w-full h-full flex flex-col">
              <div className="p-2 flex items-center bg-sidebar border-b">
                <input
                  type="text"
                  defaultValue={selectedNote.title}
                  onBlur={(e) => {
                    const updatedTitle = e.target.value;
                    handleUpdateNote(selectedNote, { title: updatedTitle }, dispatch);
                  }}
                  onKeyUp={(e) => {
                    if (e.key == "Enter") {
                      const updatedTitle = e.currentTarget.value;
                      handleUpdateNote(selectedNote, { title: updatedTitle }, dispatch);
                    }
                  }}
                  className="bg-transparent text-lg font-semibold focus:outline-none w-full p-0.5"
                />
              </div>
              {/* Note Editor */}
              <div contentEditable onKeyDown={handleInput} className="flex flex-col flex-1 p-4 focus:outline-none" suppressContentEditableWarning={true}>
                <div className="block"><br /></div>
              </div>
            </div>
          )}
          <SidebarTrigger className="md:hidden absolute top-0 left-0" />
        </div>
      </div>
    </SidebarProvider>
  )
}
