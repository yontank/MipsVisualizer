import RegMemViewer from "./components/RegMemViewer"
import DebugUI from "@/components/DebugUI"
import ExecutionDisplay from "@/components/ExecutionPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import EmulatorTableUI from "./components/MarsEmulatorUI/page"
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
        <div className="bg-blue-500 flex-1 overflow-auto resize-x min-w-36">
          Diagram
        </div>

        <RegMemViewer />
      </div>
    </>
  )
}

export default App
