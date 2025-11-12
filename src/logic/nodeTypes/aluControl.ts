import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

/**
 * Returns the correct ALU control input bits based on the `ALUOp` bits and `funct` bits.
 *
 * NOTE: The simple single-cycle diagram from the book doesn't implement any other I-type instructions than
 * `addi`, `beq`, `lw` and `sw`. But the 2025a-81 exam uses the `ori` instruction. So to support it, we make the `11`
 * aluOp bits do the `or` operation, even though this wasn't defined in the book.
 */
function aluControlInput(aluOp: number, funct: number) {
  switch (aluOp) {
    case 0b00: // lw or sw
      return 0b0010 // Add
    case 0b01: // beq
      return 0b0110 // Subtract
    case 0b11: // ori (Not standard)
      return 0b0001 // or
    case 0b10: // R-type
      switch (funct) {
        case 0b100000: // add
          return 0b0010
        case 0b100010: // sub
          return 0b0110
        case 0b100100: // and
          return 0b0000
        case 0b100101: // or
          return 0b0001
        case 0b101010: // slt
          return 0b0111
      }
  }
  return 0 // Should be unreachable.
}

export const aluControl: NodeType<Outputs> = nodeType(
  [{ id: "in" }, { id: "control" }] as const,
  (_, inputs) => ({
    out: aluControlInput(inputs.control, inputs.in),
  }),
)
