import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

/**
 * Logical `and` gate.
 */
export const and: NodeType<Outputs> = nodeType(
  [{ id: "in0" }, { id: "in1" }] as const,
  (_, inputs) => ({ out: inputs.in0 & inputs.in1 }),
)
