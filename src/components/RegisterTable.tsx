import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { int2hex } from "@/lib/utils"
import { useSimulationContext } from "@/context/SimulationContext"
import { registerNames } from "@/constants"
import type { Simulation } from "@/logic/simulation"
import { Button } from "./ui/button"
import { Edit } from "lucide-react"

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

const titles = ["Name", "Number", "Value"]

function Index() {
  const { simulation } = useSimulationContext()

  const regChange = simulation?.lastChanges.find((c) => c.type == "regset")

  return (
    <>
      <div className="p-2">
        <Button variant="outline" className="w-full">
          <Edit />
          Edit
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {titles.map((e) => (
              <TableHead key={e} className="text-center">
                {e}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {registers.map((r) => (
            <TableRow
              key={`row-${r.name}`}
              className={"odd:bg-gray-300 text-center"}
              style={
                regChange && regChange.register === r.number
                  ? { background: "burlywood" }
                  : {}
              }
            >
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.number}</TableCell>
              <TableCell>
                {simulation ? int2hex(r.value(simulation)) : "0x00000000"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Index
