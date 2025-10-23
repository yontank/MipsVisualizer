import type { NodeType } from "../simulation"

// "slt" isn't supported yet.

type ALUFunc = (a: number, b: number) => number
const ALUActions: Record<number, ALUFunc> = {
  [0b0000]: (a, b) => a & b, // And
  [0b0001]: (a, b) => a | b, // Or
  [0b0010]: (a, b) => a + b, // Add
  [0b0110]: (a, b) => a - b, // Subtract
  [0b1100]: (a, b) => ~(a | b), // Nor
}

const inputs = [
  {
    id: "in0",
  },
  {
    id: "in1",
  },
  {
    id: "control",
  },
] as const

type Outputs = ["result", "zero"]

export const ALU: NodeType<typeof inputs, Outputs> = {
  inputs,
  executeRising: (_, inputs) => {
    const result = ALUActions[inputs.control](inputs.in0, inputs.in1)
    return {
      result,
      zero: result == 0 ? 1 : 0,
    }
  },
}
