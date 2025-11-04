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
import { Asterisk, Check, Edit } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { DialogTitle } from "@radix-ui/react-dialog"

type RegisterSetMode = "set" | "multiply"

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

function SetRegistersDialog(props: {
  trigger: ReactNode
  setEditingValues: (s: string[]) => void
}) {
  const [regMultiplier, setRegMultiplier] = useState("1")
  const [changeMode, setChangeMode] = useState<RegisterSetMode>("set")

  const setValues = () => {
    const value = Number(regMultiplier)
    props.setEditingValues(
      Array.from({ length: NUM_REGISTERS }, (_, i) => {
        return int2hex(changeMode == "set" ? value : i * value)
      }),
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Registers</DialogTitle>
        </DialogHeader>
        <RadioGroup
          value={changeMode}
          onValueChange={(v: RegisterSetMode) => setChangeMode(v)}
        >
          <div className="flex gap-2">
            <RadioGroupItem id="registerValueSet" value="set" />
            <Label htmlFor="registerValueSet">
              Set each register's value to this
            </Label>
          </div>
          <div className="flex gap-2">
            <RadioGroupItem id="registerValueMultiply" value="multiply" />
            <Label htmlFor="registerValueMultiply">
              Multiply each register's index by this
            </Label>
          </div>
        </RadioGroup>
        <Input
          value={regMultiplier}
          onChange={(e) => setRegMultiplier(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={setValues}>
              Set
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RegisterTable() {
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

  useEffect(() => {
    if (simulation != undefined) {
      setEditingValues(undefined)
    }
  }, [simulation])

  return (
    <>
      <div className="p-2 flex gap-2">
        {editingValues ? (
          <>
            <SetRegistersDialog
              setEditingValues={setEditingValues}
              trigger={
                <Button className="grow" variant="outline">
                  <Asterisk />
                  Set All...
                </Button>
              }
            />
            <Button className="grow" variant="outline" onClick={stopEditing}>
              <Check />
              Done
            </Button>
          </>
        ) : (
          <Button
            className="grow"
            variant="outline"
            onClick={startEditing}
            disabled={!!simulation}
          >
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
                {editingValues && r.number !== undefined && r.number > 0 ? (
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
