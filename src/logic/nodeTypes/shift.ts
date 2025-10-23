import type { NodeType } from "../simulation"

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
): NodeType<typeof inputs, Outputs> {
  return {
    inputs,
    executeRising: (_, inputs) => ({
      out: dir == "left" ? inputs.in << bits : inputs.in >> bits,
    }),
  }
}
