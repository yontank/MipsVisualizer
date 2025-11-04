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
import { NUM_REGISTERS, registerNames } from "@/constants"
import type { Simulation } from "@/logic/simulation"
import { Button } from "./ui/button"
import { Check, Edit } from "lucide-react"
import { useState } from "react"

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

const MASK_32 = 0xffffffff

function Index() {
  const { simulation, initialRegisters, setInitialRegisters } =
    useSimulationContext()
  const [editingValues, setEditingValues] = useState<string[]>()

  const regChange = simulation?.lastChanges.find((c) => c.type == "regset")

  const startEditing = () => {
    setEditingValues(
      initialRegisters?.map((r) => int2hex(r)) ??
        Array.from({ length: NUM_REGISTERS }, () => "0x00000000"),
    )
  }

  const stopEditing = () => {
    setEditingValues(undefined)
    setInitialRegisters(editingValues!.map((v) => Number(v) & MASK_32))
  }

  return (
    <>
      <div className="p-2">
        {editingValues ? (
          <>
            <Button variant="outline" onClick={stopEditing}>
              <Check />
              Done
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={startEditing}>
            <Edit />
            Edit
          </Button>
        )}
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
                {editingValues && r.number !== undefined ? (
                  <input
                    className="outline rounded-sm focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    value={editingValues[r.number]}
                    onChange={(e) =>
                      setEditingValues(
                        editingValues.map((v, i) =>
                          i == r.number ? e.target.value : v,
                        ),
                      )
                    }
                  />
                ) : simulation ? (
                  int2hex(r.value(simulation))
                ) : (
                  int2hex(r.number ? initialRegisters[r.number] : 0)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Index
