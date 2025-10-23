import type { NodeType } from "../simulation"

const inputs = [
  {
    id: "in0",
  },
  {
    id: "in1",
  },
] as const

type Outputs = ["out"]

/**
 * A node type that outputs the sum of its two inputs.
 */
export const adder: NodeType<typeof inputs, Outputs> = {
  inputs,
  executeRising: (_, inputs) => ({ out: inputs.in0 + inputs.in1 }),
}
