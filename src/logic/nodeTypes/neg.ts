import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

/**
 * Negates the input.
 */
export const neg: NodeType<Outputs> = nodeType(
  [
    {
      id: "in",
    },
  ] as const,
  (_, inputs) => ({
    out: -inputs.in,
  }),
  undefined,
  "Neg",
)
