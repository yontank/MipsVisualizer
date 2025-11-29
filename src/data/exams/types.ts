import type { PlacedNode } from "@/context/SimulationContext"
import type { InputID } from "@/logic/simulation"

export type SimulationTemplate = {
  /**
   * The address of the first instruction in the code.
   */
  PCAddr: number
  /**
   * The assembly code.
   */
  code: string
  /**
   * An optional function that, given an address (of a word), returns the value at that address.
   */
  memoryInit?: (address: number) => number
  /**
   * Initial values of all registers.
   */
  registerInit: number[]
  /**
   * Additional nodes that are placed on the diagram.
   */
  placedNodes?: Record<InputID, PlacedNode>
  /**
   * The line that the question asks to examine (probably unused)
   */
  lineExecution?: number
}
