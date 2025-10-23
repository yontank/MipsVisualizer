import type { NodeType } from "../simulation"

const inputs = [
  {
    id: "in",
  },
] as const

type OutTemplate = `out${number}`

type Outputs = Record<number, OutTemplate>

function extractBits(n: number, start: number, end: number) {
  const mask = ((1 << (end - start + 1)) - 1) << start
  return (n & mask) >>> start
}

/**
 * Creates a "splitter" node type - a node that just forwards its input to all its outputs.
 * It can also optionally split the input into different bit ranges.
 * @param numOutputs The number of outputs that the node will have.
 * @param bitRanges If given, each output will be split into the given bit ranges (inclusive)
 */
export function makeSplitter(
  numOutputs: number,
  bitRanges?: [start: number, end: number][],
): NodeType<typeof inputs, Outputs> {
  return {
    inputs,
    executeRising: (_, inputs) => {
      const values: Record<OutTemplate, number> = {}
      for (let i = 0; i < numOutputs; i++) {
        values[`out${i}`] = bitRanges
          ? extractBits(inputs.in, ...bitRanges[i])
          : inputs.in
      }
      return values
    },
  }
}
