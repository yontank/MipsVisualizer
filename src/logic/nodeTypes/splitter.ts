import { nodeType, type NodeType } from "../simulation"

const inputs = [
  {
    id: "in",
  },
] as const

type OutTemplate = `out${number}`

type Outputs = Record<number, OutTemplate>

function extractBits(n: number, start: number, end: number) {
  if (start == 0 && end == 31) {
    return n
  }
  const mask = (1 << (end - start + 1)) - 1
  return (n >>> start) & mask
}

/**
 * Creates a "splitter" node type - a node that just forwards its input to all its outputs.
 * It can also optionally split the input into different bit ranges.
 * @param numOutputs The number of outputs that the node will have.
 * @param bitRanges If given, each output will be split into the given bit ranges (inclusive)
 */
export function makeSplitter(
  numOutputs: number,
  bitRanges?: ([start: number, end: number] | undefined)[],
): NodeType<Outputs> {
  return nodeType(inputs, (_, inputs) => {
    const values: Record<OutTemplate, number> = {}
    for (let i = 0; i < numOutputs; i++) {
      const extractRange = bitRanges?.[i]
      values[`out${i}`] = extractRange
        ? extractBits(inputs.in, ...extractRange)
        : inputs.in
    }
    return values
  })
}
