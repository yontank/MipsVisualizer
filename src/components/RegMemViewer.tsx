import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MemoryTable } from "./MemoryTable"
import { RegisterTable } from "./RegisterTable"

function RegMemViewer() {
  return (
    <Tabs defaultValue="register" className="w-sidebar">
      <div className="flex justify-center w-full z-50">
        <TabsList className="w-full">
          <TabsTrigger value="register">Registers</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="register" className="overflow-y-auto">
        <RegisterTable />
      </TabsContent>

      <TabsContent value="memory">
        <MemoryTable />
      </TabsContent>
    </Tabs>
  )
}

export default RegMemViewer
