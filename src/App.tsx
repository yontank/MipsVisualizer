/// <reference types="vite-plugin-svgr/client" />

import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import ExecutionDisplay from "@/components/ExecutionPanel"

import TestDiagram from "@/assets/diagram.svg?react"

function App() {
  return (
    <>
      {/* <ExecutionPanel/> */}
      <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2">
        <DebugUI />
      </div>

      <div className="flex h-screen">
        <ExecutionDisplay />

        <div className="flex-1 flex justify-center items-center overflow-auto min-w-36">
          <TestDiagram />
        </div>

        <RegMemViewer />
      </div>
    </>
  )
}

export default App
