import { nodeType, type NodeType } from "../simulation"

const inputs = [
  {
    id: "in",
  },
] as const

type Outputs = ["out"]

export type ShiftKind = "left" | "right" | "rightLogical"

const shiftFuncs: Record<ShiftKind, (a: number, b: number) => number> = {
  left: (a, b) => a << b,
  right: (a, b) => a >> b,
  rightLogical: (a, b) => a >>> b,
}

const shiftLabels: Record<ShiftKind, string> = {
  left: "Shift\nleft",
  right: "Shift\nright",
  rightLogical: "SRL",
}

/**
 * Creates a node type that shifts its input.
 * @param kind The kind of shift to perform.
 * @param bits The number of bits to shift by.
 */
export function makeShifter(kind: ShiftKind, bits: number): NodeType<Outputs> {
  return nodeType(
    inputs,
    (_, inputs) => ({
      out: shiftFuncs[kind](inputs.in, bits),
    }),
    undefined,
    `${shiftLabels[kind]} ${bits}`,
  )
}
