"use server"
import { useSimulationContext } from "@/context/SimulationContext"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function ExecutionPanel() {
  const { simulation, prevPc } = useSimulationContext()
  /**
   * If there's no Simulation object yet, it means we havent compiled the MIPS code to visualize it, show some boiler plate message about how
   * he needs to compile to get the code
   */
  if (!simulation)
    return (
      <div className="container mx-auto py-15">
        <div>
          <h2 className="scroll-m-20 text-center text-2xl font-bold tracking-tight text-balance">
            Not Running
          </h2>
          <h3 className="scroll-m-20 text-xl tracking-tight text-center mt-5">
            Write some assembly code, then click "compile" to start.
          </h3>
        </div>
      </div>
    )
  /**
   * Simulation Exists, lets render the commands and each step
   */
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={simulation.executionInfo}
        setRowStyle={(row) => {
          const address = row.original.address
          if (address == prevPc) {
            return {
              backgroundColor: "#a3deff",
              fontWeight: "bold",
            }
          }
          return {}
        }}
      />
    </div>
  )
}
