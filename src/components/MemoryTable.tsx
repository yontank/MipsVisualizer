import { int2hex } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { useSimulationContext } from "@/context/SimulationContext"
import { useState } from "react"
import { Checkbox } from "./ui/checkbox"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { Label } from "./ui/label"

export function MemoryTable() {
  const { simulation } = useSimulationContext()
  const [showInstructionMemory, setShowInstructionMemory] =
    useState<CheckedState>(false)

  let rows: [string, number | undefined][] = []
  let highlightRow: string | undefined
  if (simulation) {
    rows = Object.entries(simulation.memory)
    const executionInfo = simulation.executionInfo
    if (!showInstructionMemory && executionInfo.length > 0) {
      // If the "Show instruction memory" box is unchecked, we filter the rows
      // to only show addresses that aren't instructions.
      rows = rows.filter(
        ([address]) =>
          Number(address) < executionInfo[0].address ||
          Number(address) > executionInfo[executionInfo.length - 1].address,
      )
    }
    const memChange = simulation.lastChanges.find((c) => c.type == "memset")
    if (memChange) {
      highlightRow = memChange.address.toString()
    }
  }

  return (
    <div className="p-2">
      <Label className="mb-1">
        <Checkbox
          checked={showInstructionMemory}
          onCheckedChange={setShowInstructionMemory}
        />
        Show instruction memory
      </Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([address, value]) => {
            return (
              <TableRow
                className={highlightRow == address ? "bg-amber-300" : ""}
                key={address}
              >
                <TableCell>{int2hex(Number(address))}</TableCell>
                <TableCell>{int2hex(value!)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
