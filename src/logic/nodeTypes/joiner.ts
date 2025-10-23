import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

/**
 * Joins two values by ORing them and shifting one of them.

 * Currently this is hard-coded for the join that happens in the Jump Address in the single cycle diagram.
 * We'll generalize it if it appears in more places.
 */
export const joiner: NodeType<Outputs> = nodeType(
  [
    {
      id: "in0",
    },
    {
      id: "in1",
    },
  ] as const,
  (_, inputs) => ({
    out: inputs.in0 | (inputs.in1 << 28),
  }),
)
