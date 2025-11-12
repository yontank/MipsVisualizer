import {
  BugPlayIcon,
  PlayIcon,
  PlusIcon,
  SquareIcon,
  Undo2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip"
import { useSimulationContext } from "@/context/SimulationContext"
import { useState, type ReactNode } from "react"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { makeShifter, type ShiftDirection } from "@/logic/nodeTypes/shift"
import { neg } from "@/logic/nodeTypes/neg"
import type { NodeType } from "@/logic/simulation"

type NodeInfo = {
  name: string
  node: (params: NodeCreationParams) => NodeType
  params?: boolean
}

type NodeCreationParams = {
  dir: ShiftDirection
  bits: number
}

const placeableNodes: NodeInfo[] = [
  {
    name: "Neg",
    node: () => neg,
  },
  {
    name: "Not",
    node: () => not,
  },
  {
    name: "Shift",
    params: true,
    node: (params) => makeShifter(params.dir, params.bits),
  },
]

function AddNodePopup(props: { trigger: ReactNode }) {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | undefined>()
  const [shiftDir, setShiftDir] = useState<ShiftDirection>("left")
  const [shiftBits, setShiftBits] = useState("1")

  return (
    <Popover>
      <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
      <PopoverContent
        onCloseAutoFocus={(e) => e.preventDefault()} // https://github.com/radix-ui/primitives/issues/2248#issuecomment-2037290498
        className="w-80"
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h2 className="leading-none font-medium">Add Component</h2>
            <p className="text-muted-foreground text-sm">
              Choose a component to place on a wire.
            </p>
          </div>

          <div className="flex items-center justify-around">
            {placeableNodes.map((n) => (
              <div
                key={n.name}
                className={
                  "h-fit w-fit p-3 rounded-full outline-solid outline-black text-lg cursor-pointer box-content " +
                  (selectedNode == n ? "outline-4 font-bold" : "outline-2")
                }
                onClick={() => setSelectedNode(n)}
              >
                {n.name}
              </div>
            ))}
          </div>

          {selectedNode && selectedNode.params && (
            <form>
              <h3 className="font-bold">Params:</h3>
              <div className="flex mb-2 items-baseline gap-2">
                Shift direction:
                <ToggleGroup
                  id="shift-direction"
                  type="single"
                  variant="outline"
                  value={shiftDir}
                  onValueChange={(v: ShiftDirection) => setShiftDir(v)}
                >
                  <ToggleGroupItem value="left">Left</ToggleGroupItem>
                  <ToggleGroupItem value="right">Right</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="flex items-baseline gap-2">
                Shift amount:
                <Input
                  id="shift-num-bits"
                  type="number"
                  max={31}
                  min={1}
                  className="w-[6em]"
                  value={shiftBits}
                  onChange={(e) => setShiftBits(e.target.value)}
                  onBlur={() => setShiftBits(Number(shiftBits).toString())}
                />
              </div>
            </form>
          )}

          <Button disabled={!selectedNode}>Add</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * A Component that Contains Buttons to Start, Stop, the compilation of the program
 * The Component will probably be at the top of the screen.
 * @returns
 */
function DebugUI() {
  const {
    stopSimulation,
    startSimulation,
    cycleSimulation,
    undoSimulation,
    simulation,
    simulationIndex,
    initialPC,
  } = useSimulationContext()

  /** Checks if PC Address is outside the scope of the known commands inside executionInfo.
   * calculated by  the amount of commands there are, if its outside of that range,
   * it means we're not inside the ExecutionRow Commands, and we need to let the user know he finished his execution.
   */
  const isPcAddressFinished = () => {
    if (!simulation) return false

    return (
      Number(initialPC) <= simulation.pc &&
      simulation.pc < Number(initialPC) + simulation?.executionInfo.length * 4
    )
  }

  return (
    <div className="absolute my-2.5 flex justify-center">
      <ButtonGroup className="cursor-pointer">
        <TooltipProvider>
          <ButtonGroup className="">
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:text-blue-600 cursor-pointer"
                  disabled={!!simulation}
                  onClick={startSimulation}
                >
                  <BugPlayIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compile</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={500}>
              <AddNodePopup
                trigger={
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="hover:text-green-600 cursor-pointer"
                      disabled={!!simulation}
                    >
                      <PlusIcon />
                    </Button>
                  </TooltipTrigger>
                }
              />
              <TooltipContent>
                <p>Add Component</p>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>

          <ButtonGroup>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-red-600 cursor-pointer"
                  disabled={!simulation}
                  onClick={stopSimulation}
                >
                  <SquareIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-green-600 cursor-pointer"
                  disabled={!simulation || !isPcAddressFinished()}
                  onClick={cycleSimulation}
                >
                  <PlayIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Cycle</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  className="hover:text-red-600 cursor-pointer"
                  disabled={!simulation || simulationIndex == 0}
                  onClick={undoSimulation}
                >
                  <Undo2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Cycle</p>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>
        </TooltipProvider>
      </ButtonGroup>
    </div>
  )
}

export default DebugUI
