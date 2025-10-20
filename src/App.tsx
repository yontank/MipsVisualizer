import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import ExecutionDisplay from "@/components/ExecutionPanel"
function App() {
  return (
    <>
      {/* <ExecutionPanel/> */}
      <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2">
        <DebugUI />
      </div>

      <div className="flex h-screen">
        <ExecutionDisplay />

        <div className="bg-blue-500 flex-1 overflow-auto resize-x min-w-36">
          Diagram
        </div>

        <RegMemViewer />
      </div>
    </>
  )
}

export default App
