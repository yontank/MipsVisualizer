import { neg } from "@/logic/nodeTypes/neg"
import { not } from "@/logic/nodeTypes/not"
import { makeShifter, type ShiftKind } from "@/logic/nodeTypes/shift"
import type { NodeType } from "@/logic/simulation"
import { useState, type ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useSimulationContext } from "@/context/SimulationContext"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { Input } from "./ui/input"
import { PopoverClose } from "@radix-ui/react-popover"
import { Button } from "./ui/button"

type NodeInfo = {
  name: string
  node: (params: NodeCreationParams) => NodeType
  params?: boolean
}

type NodeCreationParams = {
  kind: ShiftKind
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
    node: (params) => makeShifter(params.kind, params.bits),
  },
]

type PopoverSide = "top" | "right" | "bottom" | "left"

export function AddNodePopup(props: {
  trigger: ReactNode
  side?: PopoverSide
}) {
  const { setPlacingNode } = useSimulationContext()
  const [selectedNode, setSelectedNode] = useState<NodeInfo | undefined>()
  const [shiftKind, setShiftKind] = useState<ShiftKind>("left")
  const [shiftBits, setShiftBits] = useState("1")

  return (
    <Popover>
      <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
      <PopoverContent
        side={props.side}
        onCloseAutoFocus={(e) => e.preventDefault()} // https://github.com/radix-ui/primitives/issues/2248#issuecomment-2037290498
        className="w-[24em]"
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
                  (selectedNode == n
                    ? "bg-gray-200 outline-4 font-bold"
                    : "outline-2")
                }
                onClick={() => setSelectedNode(n)}
              >
                {n.name}
              </div>
            ))}
          </div>

          {selectedNode && selectedNode.params && (
            <>
              <div className="flex items-baseline gap-2">
                Shift direction:
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={shiftKind}
                  onValueChange={(v: ShiftKind) => setShiftKind(v)}
                >
                  <ToggleGroupItem value="left">Left</ToggleGroupItem>
                  <ToggleGroupItem value="right">Right</ToggleGroupItem>
                  <ToggleGroupItem value="rightLogical">
                    Right Logical
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="flex items-baseline gap-2">
                Shift amount:
                <Input
                  type="number"
                  max={31}
                  min={1}
                  className="w-[6em]"
                  value={shiftBits}
                  onChange={(e) => setShiftBits(e.target.value)}
                  onBlur={() => setShiftBits(Number(shiftBits).toString())}
                />
              </div>
            </>
          )}

          <PopoverClose asChild>
            <Button
              disabled={!selectedNode}
              onClick={() => {
                if (selectedNode) {
                  setPlacingNode(
                    selectedNode.node({
                      kind: shiftKind,
                      bits: Number(shiftBits),
                    }),
                  )
                }
              }}
            >
              Add
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
