import { nodeType, type NodeType } from "../simulation"

type Outputs = ["readData"]

export const dataMemory: NodeType<Outputs> = nodeType(
  [
    { id: "address" },
    { id: "writeData" },
    { id: "controlMemRead" },
    { id: "controlMemWrite" },
  ] as const,
  (simulation, inputs) => ({
    readData:
      inputs.controlMemRead == 1 ? simulation.memory[inputs.address] : 0,
  }),
  (_, inputs) => {
    if (inputs.controlMemWrite == 1) {
      return {
        type: "memset",
        address: inputs.address,
        value: inputs.writeData,
      }
    }
  },
)
