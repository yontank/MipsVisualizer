import { int2hex } from "@/lib/utils"
import { RegisterTable } from "./data-table"
import { useSimulationContext } from "@/context/SimulationContext"
import { registerNames } from "@/constants"
import type { Simulation } from "@/logic/simulation"

/**
 * An array of each register row, where each row contains:
 * - The register's name
 * - An optional number
 * - A function that retrieves the register's value from the simulation
 */
const registers: {
  name: string
  number?: number
  value: (s: Simulation) => number
}[] = [
  {
    name: "pc",
    value: (s) => s.pc,
  },
  ...registerNames.map((name, index) => ({
    name: "$" + name,
    number: index,
    value: (s: Simulation) => s.registers[index],
  })),
]

function Index() {
  const { simulation } = useSimulationContext()

  const regChange = simulation?.lastChanges.find((c) => c.type == "regset")

  return (
    <RegisterTable
      values={registers.map((r) => [
        r.name,
        String(r.number ?? ""),
        simulation ? int2hex(r.value(simulation)) : "0x00000000",
      ])}
      setRowStyle={(row) => {
        if (regChange && String(regChange.register) == row[1]) {
          return { backgroundColor: "burlywood" }
        }
      }}
    />
  )
}

export default Index
