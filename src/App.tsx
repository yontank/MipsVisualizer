/// <reference types="vite-plugin-svgr/client" />

import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import { type EditorInterface, EditorPanel } from "@/components/EditorPanel"

import TestDiagram from "@/assets/diagram.svg?react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import EmulatorTableUI from "./components/MarsEmulatorUI/page"

import { useRef } from "react"
import { Diagram } from "./components/Diagram"
import { Toaster } from "./components/ui/sonner"
import { useSimulationContext } from "./context/SimulationContext"

function App() {
  const { rightTabValue, setRightTabValue } = useSimulationContext()
  const editorInterface = useRef<EditorInterface>({ getValue: () => "" })

  return (
    <>
      <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2">
        <DebugUI />
      </div>

      <div className="flex h-screen">
        <Tabs defaultValue="IDE" value={rightTabValue}>
          <TabsList className="w-full">
            <TabsTrigger
              className="w-1/2 text-center"
              value="IDE"
              onClick={() => setRightTabValue("IDE")}
            >
              Editor
            </TabsTrigger>
            <TabsTrigger
              className="w-1/2 text-center"
              value="debugger"
              onClick={() => setRightTabValue("debugger")}
            >
              Execution
            </TabsTrigger>
          </TabsList>
          <TabsContent value="IDE">
            <EditorPanel editorInterface={editorInterface} />
          </TabsContent>

          <TabsContent value="debugger">
            <EmulatorTableUI />
          </TabsContent>
        </Tabs>
        <div className="flex-1 flex justify-center items-center overflow-auto min-w-36">
          <Diagram svg={TestDiagram} />
        </div>
        <RegMemViewer />
      </div>
      <Toaster />
    </>
  )
}

export default App
