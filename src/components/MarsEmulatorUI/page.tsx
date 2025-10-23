"use server"
import { useSimulationContext } from "@/context/SimulationContext"
import { columns, type CompiledMIPS } from "./columns"
import { DataTable } from "./data-table"

/**
 * TODO: Intergrade simulation array of hexadecimal codes into here.
 *
 * @returns
 */
function getData(): CompiledMIPS[] {
  // Fetch data from your API here.

  return [
    {
      id: "",
      address: "0x00400000",
      code: "0x1234567",
      source: "add $6 , $2, $1",
    },
    {
      id: "728ed52f",
      address: "0x00400004",
      code: "0x3C010000",
      source: "sw $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x00400008",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x0040000C",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
  ]
}

export default function DemoPage() {
  const { simulation } = useSimulationContext()
  const data = getData()
  /**
   * If there's no Simulation object yet, it means we havent compiled the MIPS code to visualize it, show some boiler plate message about how
   * he needs to compile to get the code
   */
  if (!simulation)
    return (
      <div className="container mx-auto py-15 w-[375px]">
        <div>
          <h2 className="scroll-m-20 text-center text-5xl font-bold tracking-tight text-balance">
            No Compiled Code yet
          </h2>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center mt-5">
            {" "}
            Write some MIPS Code, Compile it, and lets see what those wires do
          </h3>
        </div>
      </div>
    )
  /**
   * Simulation Exists, lets render the commands and each step
   */
  return (
    <div className="container mx-auto py-10 w-[375px]">
      <DataTable
        columns={columns}
        data={data}
        setRowStyle={(row) => {
          const address = row.original.address
          if (address === "0x00400000") return { backgroundColor: "teal" }
          return {}
        }}
      />
    </div>
  )
}
