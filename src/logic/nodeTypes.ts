import type { NodeType } from "./simulation"

export const ALU: NodeType = {
  inputs: [
    {
      id: "operandA",
    },
    {
      id: "operandB",
    },
  ],
  outputs: [
    {
      id: "result",
    },
  ],
  executeRising: (_, inputs) => {
    // TODO incomplete
    return {
      result: inputs.operandA + inputs.operandB,
    }
  },
}

export const registerFile: NodeType = {
  inputs: [
    {
      id: "read1",
    },
    {
      id: "read2",
    },
    {
      id: "write",
    },
    {
      id: "writeData",
    },
    {
      id: "regWrite",
    },
  ],

  outputs: [
    {
      id: "data1",
    },
    {
      id: "data2",
    },
  ],

  executeRising: (simulation, inputs) => {
    return {
      data1: simulation.registers[inputs.read1],
      data2: simulation.registers[inputs.read2],
    }
  },

  executeFalling: (simulation, inputs) => {
    if (inputs.regWrite) {
      simulation.registers[inputs.write] = inputs.writeData
      return {
        type: "regset",
        register: inputs.write,
        value: inputs.writeData,
      }
    }

    return undefined
  },
}
