import { nodeType, type NodeType } from "../simulation"

type Outputs = ["data1", "data2"]

export const registerFile: NodeType<Outputs> = nodeType(
  [
    {
      id: "readRegister1",
    },
    {
      id: "readRegister2",
    },
    {
      id: "writeRegister",
      falling: true,
    },
    {
      id: "writeData",
      falling: true,
    },
    {
      id: "controlRegWrite",
      falling: true,
    },
  ] as const,

  (simulation, inputs) => ({
    data1: simulation.registers[inputs.readRegister1],
    data2: simulation.registers[inputs.readRegister2],
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
