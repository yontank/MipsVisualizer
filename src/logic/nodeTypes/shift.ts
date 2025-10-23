import { nodeType, type NodeType } from "../simulation"

const inputs = [
  {
    id: "in",
  },
] as const

type Outputs = ["out"]

/**
 * Creates a node type that shifts its input.
 * @param dir The direction to shift into.
 * @param bits The number of bits to shift by.
 */
export function makeShifter(
  dir: "left" | "right",
  bits: number,
): NodeType<Outputs> {
  return nodeType(inputs, (_, inputs) => ({
    out: dir == "left" ? inputs.in << bits : inputs.in >> bits,
  }))
}
