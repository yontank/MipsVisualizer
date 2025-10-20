import type { NodeType } from "./simulation"

export const ALU: NodeType = {
  label: "ALU",
  style: "ALU",
  inputs: [
    {
      id: "operandA",
      name: "",
    },
    {
      id: "operandB",
      name: "",
    },
  ],
  outputs: [
    {
      id: "result",
      name: "",
    },
  ],
  executeRising: (_, inputs, outputs) => {
    // TODO incomplete
    outputs.result = inputs.operandA + inputs.operandB
  },
}

export const registerFile: NodeType = {
  label: "Register File",
  style: "rectangle",
  inputs: [
    {
      id: "read1",
      name: "Read register 1",
    },
    {
      id: "read2",
      name: "Read register 2",
    },
    {
      id: "write",
      name: "Write register",
    },
    {
      id: "writeData",
      name: "Write data",
    },
    {
      id: "regWrite",
      name: "",
    },
  ],
  outputs: [
    {
      id: "data1",
      name: "Read data 1",
    },
    {
      id: "data2",
      name: "Read data 2",
    },
  ],
  executeRising: (simulation, inputs, outputs) => {
    outputs.data1 = simulation.registers[inputs.read1]
    outputs.data2 = simulation.registers[inputs.read2]
  },
  executeFalling: (simulation, inputs) => {
    if (inputs.regWrite) {
      simulation.registers[inputs.write] = inputs.writeData
    }
  },
}
