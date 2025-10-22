/// <reference types="vite-plugin-svgr/client" />

import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import ExecutionDisplay from "@/components/ExecutionPanel"

import TestDiagram from "@/assets/diagram.svg?react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import EmulatorTableUI from "./components/MarsEmulatorUI/page"
import { editor } from "monaco-editor"
import React, { useState, useRef } from "react"

function App() {
  const [IDEErrorLine, setIDEErrorLine] = useState<number | undefined>(1)
  const [pcValue, setPCValue] = useState("")
  const editorRef = useRef<editor.IStandaloneCodeEditor | undefined>(undefined)

  const onCompile = () => {
    // editorRef: RefObject<editor.IStandaloneCodeEditor>
    const ideText = editorRef.current?.getValue()
    console.log(ideText)
    // TODO: Run Compiler.

    // TODO: If the Compiler didnt work, Send Error Msg To to the IDE with number and shit
    setIDEErrorLine(() => 5)
    // TODO: otherwise, set the simulation as needed.
  }

  const onStop = () => {
    // TODO: Set Simulation Context to undefined,
    // TODO: anything else, bruv?
  }

  const onNextCycle = () => {
    // TODO: Save context into History
    // TODO: Execute the MIPS Emulator, and update the Simulation Context
  }

  const onUndo = () => {
    // TODO: Get The History Of Simulations, and choose the last one.
  }

  return (
    <>
      <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2">
        <DebugUI
          onCompile={onCompile}
          onNextCycle={onNextCycle}
          onStop={onStop}
          onUndo={onUndo}
        />
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
            <ExecutionDisplay
              editorRef={editorRef}
              errorLine={IDEErrorLine}
              pcValue={pcValue}
              setPCValue={setPCValue}
            />
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
