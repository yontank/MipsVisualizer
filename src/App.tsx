import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import ExecutionDisplay from "@/components/ExecutionPanel"
function App() {
  return (
    <>
      {/* <ExecutionPanel/> */}
      <div className="absolute  position-fixed  right-4 z-50">
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
