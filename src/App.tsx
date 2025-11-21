/// <reference types="vite-plugin-svgr/client" />

import RegMemViewer from "./components/RegMemViewer"
import { DebugUI } from "@/components/DebugUI"
import { type EditorInterface, EditorPanel } from "@/components/EditorPanel"

import TestDiagram from "@/assets/diagram.svg?react"

import { Tabs, TabsContent } from "./components/ui/tabs"
import ExecutionPanel from "./components/ExecutionPanel"

import { useRef } from "react"
import { Diagram } from "./components/Diagram"
import { Toaster } from "./components/ui/sonner"
import { useSimulationContext } from "./context/SimulationContext"

function App() {
  const { simulation } = useSimulationContext()
  const editorInterface = useRef<EditorInterface>({ getValue: () => "" })

  return (
    <>
      <DebugUI />

      <div className="flex h-screen">
        <Tabs
          defaultValue="editor"
          value={simulation ? "execution" : "editor"}
          className="w-sidebar"
        >
          <TabsContent value="editor">
            <EditorPanel editorInterface={editorInterface} />
          </TabsContent>

          <TabsContent value="execution">
            <ExecutionPanel />
          </TabsContent>
        </Tabs>

        <div className="flex-1 flex justify-center items-center overflow-auto min-w-36">
          <Diagram svg={TestDiagram} />
        </div>

        <RegMemViewer />
      </div>
      <Toaster richColors visibleToasts={1} duration={10000} closeButton />
    </>
  )
}

export default App
