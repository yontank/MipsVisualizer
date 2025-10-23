import type { NodeType } from "../simulation"

const inputs = [
  {
    id: "in",
  },
] as const

type Outputs = ["out"]

export const pc: NodeType<typeof inputs, Outputs> = {
  inputs,
  executeRising: (simulation) => ({ out: simulation.pc }),
  executeFalling: (_, inputs) => {
    return {
      type: "pcset",
      value: inputs.in,
    }
  },
}
