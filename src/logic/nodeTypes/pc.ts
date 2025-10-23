import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

export const pc: NodeType<Outputs> = nodeType(
  [
    {
      id: "in",
      falling: true,
    },
  ] as const,
  (simulation) => ({ out: simulation.pc }),
  (_, inputs) => {
    return {
      type: "pcset",
      value: inputs.in,
    }
  },
)
