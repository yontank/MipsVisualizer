import { nodeType, type NodeType, type OutputObject } from "../simulation"

type Outputs = [
  "regDst",
  "jump",
  "branch",
  "memRead",
  "memToReg",
  "aluOp",
  "memWrite",
  "aluSrc",
  "regWrite",
]

const outputMap: Record<number, OutputObject<Outputs>> = {
  // R-type
  [0]: {
    regDst: 1,
    aluSrc: 0,
    memToReg: 0,
    regWrite: 1,
    memRead: 0,
    memWrite: 0,
    branch: 0,
    aluOp: 0b10,
    jump: 0,
  },
  // lw
  [35]: {
    regDst: 0,
    aluSrc: 1,
    memToReg: 1,
    regWrite: 1,
    memRead: 1,
    memWrite: 0,
    branch: 0,
    aluOp: 0b00,
    jump: 0,
  },
  // sw
  [43]: {
    regDst: 0, // x
    aluSrc: 1,
    memToReg: 0, // x
    regWrite: 0,
    memRead: 0,
    memWrite: 1,
    branch: 0,
    aluOp: 0b00,
    jump: 0,
  },
  // beq
  [4]: {
    regDst: 0, // x
    aluSrc: 0,
    memToReg: 0, // x
    regWrite: 0,
    memRead: 0,
    memWrite: 0,
    branch: 1,
    aluOp: 0b01,
    jump: 0,
  },
  // addi
  [8]: {
    regDst: 0,
    aluSrc: 1,
    memToReg: 0,
    regWrite: 1,
    memRead: 0,
    memWrite: 0,
    branch: 0,
    aluOp: 0b00,
    jump: 0,
  },
  // ori
  [13]: {
    regDst: 0,
    aluSrc: 1,
    memToReg: 0,
    regWrite: 1,
    memRead: 0,
    memWrite: 0,
    branch: 0,
    aluOp: 0b11, // Not standard. See note in aluControl.ts
    jump: 0,
  },
  // j
  [2]: {
    regDst: 0, // x
    aluSrc: 0, // x
    memToReg: 0, // x
    regWrite: 0,
    memRead: 0,
    memWrite: 0,
    branch: 0, // x
    aluOp: 0b00, // x
    jump: 1,
  },
}

/**
 * The control unit.
 *
 * Its input is expected to be just the 6 opcode bits of an instruction.
 */
export const control: NodeType<Outputs> = nodeType(
  [
    {
      id: "in",
    },
  ] as const,
  (_, inputs) => outputMap[inputs.in],
  undefined,
  () => ({
    aluOp: 2,
    aluSrc: 1,
    branch: 1,
    jump: 1,
    memRead: 1,
    memToReg: 1,
    memWrite: 1,
    regDst: 1,
    regWrite: 1,
  }),
)
