import type { NodeType } from "../simulation"

const inputs = [
  {
    id: "readAddress",
  },
] as const

type Outputs = ["instruction"]

/**
 * A node type that outputs the value at the desired memory address.
 * It's called "instruction memory" because it's split like that in the diagram,
 * but it can output any memory address.
 */
export const instructionMemory: NodeType<typeof inputs, Outputs> = {
  inputs,
  executeRising: (simulation, inputs) => ({
    instruction: simulation.memory[inputs.readAddress],
  }),
}
