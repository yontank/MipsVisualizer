import type { NodeType } from "../simulation"

const inputs = [
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
] as const

type Outputs = ["data1", "data2"]

export const registerFile: NodeType<typeof inputs, Outputs> = {
  inputs,

  executeRising: (simulation, inputs) => {
    return {
      data1: simulation.registers[inputs.read1],
      data2: simulation.registers[inputs.read2],
    }
  },

  executeFalling: (simulation, inputs) => {
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
}
