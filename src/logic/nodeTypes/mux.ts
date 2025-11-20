import { nodeType, type NodeType } from "../simulation"

type Outputs = ["out"]

type Mux = NodeType<Outputs>

/**
 * Stores all the mux nodetypes created so far, based on their number of inputs.
 */
const cache: Record<number, Mux> = {}

/**
 * Creates a mux NodeType - a node that selects one of many inputs based on the `control` input.
 * @param numInputs The number of inputs the mux will have.
 */
export function makeMux(numInputs: number): Mux {
  if (cache[numInputs]) {
    return cache[numInputs]
  }

  const mux: Mux = nodeType(
    [
      // The inputs of a mux are "control", and "in" followed by the index.
      { id: "control" } as const,
      ...Array.from({ length: numInputs }, (_, i) => ({
        id: `in${i}` as const,
      })),
    ],
    (_, inputs) => ({
      out: inputs[`in${inputs.control}`],
    }),
    undefined,
    // The bit widths of each input are assumed to be the same, so we simply return the first one's.
    (get) => ({ out: get("in0") }),
  )

  cache[numInputs] = mux

  return mux
}
