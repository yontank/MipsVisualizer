import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

/**
 * A node type that outputs the sum of its two inputs.
 */
export const adder: NodeType<Outputs> = nodeType(
  [
    {
      id: "in0",
    },
    {
      id: "in1",
    },
  ] as const,
  (_, inputs) => ({
    out: inputs.in0 + inputs.in1,
  }),
)
