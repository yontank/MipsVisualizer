import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

/**
 * Does a binary `not` on the input.
 */
export const not: NodeType<Outputs> = nodeType(
  [
    {
      id: "in",
    },
  ] as const,
  (_, inputs) => ({
    out: ~inputs.in,
  }),
  undefined,
  (get) => ({ out: get("in") }),
  "Not",
)
