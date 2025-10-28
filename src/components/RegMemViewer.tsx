import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import MemoryTable from "@/components/MemoryTable"
import RegisterTable from "./RegisterTable"

function RegMemViewer() {
  // Todo update SetMemory Arr after getting submitting the input location of the memory address
  // Todo: Make Virtualized Table Specific For Memory Table to make it less Memory Hungry

  return (
    <div className="w-fit  overflow-x-hidden max-w-xl h-screen  border rounded-md  overflow-auto ">
      <Tabs defaultValue="register" className="w-[325px]">
        <div className="flex justify-center w-full sticky top-2 z-50 h-full my-2">
          <TabsList className="w-full">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="register">
          <RegisterTable />
        </TabsContent>

        <TabsContent
          value="memory"
          className="overflow-y-hidden overflow-x-hidden"
        >
          <MemoryTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RegMemViewer
