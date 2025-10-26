import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

const SIGN_BIT_16 = 0b1000000000000000

/**
 * Sign extends a 16-bit number to a 32-bit number.
 */
export const signExtend: NodeType<Outputs> = nodeType(
  [
    {
      id: "in",
    },
  ] as const,
  (_, inputs) => ({
    out:
      inputs.in | ((inputs.in & SIGN_BIT_16) == SIGN_BIT_16 ? 0xffff0000 : 0),
  }),
)
