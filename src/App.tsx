/// <reference types="vite-plugin-svgr/client" />

import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import ExecutionDisplay from "@/components/ExecutionPanel"

import TestDiagram from "@/assets/diagram.svg?react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import EmulatorTableUI from "./components/MarsEmulatorUI/page"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
function App() {
  return (
    <>
      {/* <ExecutionPanel/> */}
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
            <ExecutionDisplay />
          </TabsContent>

          <TabsContent value="debugger">
            <EmulatorTableUI />
          </TabsContent>
        </Tabs>
        <div className="flex-1 flex justify-center items-center overflow-auto min-w-36">
          <TestDiagram />
        </div>

        <RegMemViewer />
      </div>
    </>
  )
}


export default App
