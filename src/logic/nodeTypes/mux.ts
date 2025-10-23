import type { NodeType } from "../simulation"

type Outputs = ["out"]

const makeInputs = (numInputs: number) => [
  { id: "control" } as const,
  ...Array.from({ length: numInputs }, (_, i) => ({ id: `in${i}` as const })),
]

type Mux = NodeType<ReturnType<typeof makeInputs>, Outputs>

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

  const inputs = makeInputs(numInputs)

  const mux: Mux = {
    inputs,
    executeRising: (_, inputs) => ({ out: inputs[`in${inputs.control}`] }),
  }

  cache[numInputs] = mux

  return mux
}
