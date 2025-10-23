import { nodeType, type NodeType } from "../simulation"

type Outputs = ["instruction"]

/**
 * A node type that outputs the value at the desired memory address.
 * It's called "instruction memory" because it's split like that in the diagram,
 * but it can output any memory address.
 */
export const instructionMemory: NodeType<Outputs> = nodeType(
  [
    {
      id: "readAddress",
    },
  ] as const,
  (simulation, inputs) => ({
    instruction: simulation.memory[inputs.readAddress],
  }),
)
