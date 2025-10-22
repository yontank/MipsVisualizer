/// <reference types="vite-plugin-svgr/client" />

import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import { type EditorInterface, EditorPanel } from "@/components/EditorPanel"

import TestDiagram from "@/assets/diagram.svg?react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import EmulatorTableUI from "./components/MarsEmulatorUI/page"
import { useRef, useState } from "react"
import type { Simulation } from "./logic/simulation"
import { SimulationContext } from "./context/SimulationContext"
import { Diagram } from "./components/Diagram"

function App() {
  const [simulation, setSimulation] = useState<Simulation | undefined>()
  const editorInterface = useRef<EditorInterface>({ getValue: () => "" })
  const [pcValue, setPCValue] = useState("")

  const compile = () => {
    console.log(editorInterface.current.getValue())
  }

  const stopSimulation = () => {
    setSimulation(undefined)
  }

  return (
    <SimulationContext
      value={{ simulation, startSimulation: compile, stopSimulation }}
    >
      <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2">
        <DebugUI />
      </div>

      <div className="flex h-screen">
        <Tabs defaultValue="IDE">
          <TabsList className="w-full">
            <TabsTrigger className="w-1/2 text-center" value="IDE">
              Editor
            </TabsTrigger>
            <TabsTrigger className="w-1/2 text-center" value="debugger">
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
          <Diagram simulation={simulation} svg={TestDiagram} />
        </div>
        <RegMemViewer />
      </div>
    </SimulationContext>
  )
}

export default App
