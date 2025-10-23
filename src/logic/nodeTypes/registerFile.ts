import { nodeType, type NodeType } from "../simulation"

type Outputs = ["data1", "data2"]

export const registerFile: NodeType<Outputs> = nodeType(
  [
    {
      id: "read1",
    },
    {
      id: "read2",
    },
    {
      id: "writeRegister",
    },
    {
      id: "writeData",
    },
    {
      id: "controlRegWrite",
    },
  ] as const,

  (simulation, inputs) => ({
    data1: simulation.registers[inputs.read1],
    data2: simulation.registers[inputs.read2],
  }),

  (simulation, inputs) => {
    if (inputs.controlRegWrite) {
      simulation.registers[inputs.writeRegister] = inputs.writeData
      return {
        type: "regset",
        register: inputs.writeRegister,
        value: inputs.writeData,
      }
    }

    return undefined
  },
)
