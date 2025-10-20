/**
 * The number of registers in the CPU.
 */
export const MAX_REGISTERS = 32

// TODO figure out a way to statically type node input IDs and the `inputs` parameter in `execute`
/**
 * An object describing a node - its inputs, outputs, behavior and style.
 */
export type NodeType = {
  /**
   * The text that should be displayed as this node's label.
   */
  label: string
  /**
   * A string that decides what style this node should be rendered in.
   */
  style: string

  /**
   * An array of the inputs this node has.
   */
  inputs: {
    /**
     * A string that uniquely identifies this input in this node.
     */
    id: string
    /**
     * The display name of the input.
     */
    name: string
    /**
     * When the input changes, an update of the node will only trigger during this specified part of the clock cycle.
     * If it's not defined, it's assumed to be `"rising"`.
     */
    clockMode?: "rising" | "falling"
  }[]

  /**
   * An array of the outputs this node has.
   */
  outputs: {
    /**
     * A string that uniquely identifies this output in this node.
     */
    id: string
    /**
     * The display name of the output.
     */
    name: string
  }[]

  /**
   * This function is called during the rising part of the clock cycle.
   * The simulation and inputs of the node are given. The outputs must be written to the `outputs` object.
   * @param simulation The simulation that the node is in.
   * @param inputs An object containing the values of all inputs.
   * @param outputs An object where the values of the node's outputs should be written to.
   */
  executeRising: (
    simulation: Simulation,
    inputs: Record<string, number>,
    outputs: Record<string, number>,
  ) => void

  /**
   * This function is called during the falling part of the clock cycle.
   * The simulation and inputs of the node are given. The node may update the simulation's state here.
   * @param simulation The simulation that the node is in.
   * @param inputs An object containing the values of all inputs.
   */
  executeFalling?: (
    simulation: Simulation,
    inputs: Record<string, number>,
  ) => void
}

/**
 * An instance of a node in a simulation.
 */
export type Node = {
  /**
   * A string that uniquely identifies this node within the simulation.
   */
  id: string
  /**
   * This node's type.
   */
  type: NodeType
}

/**
 * A reference to an input within a node.
 */
export type NodeInputRef = {
  /**
   * The ID of the node.
   */
  nodeId: string
  /**
   * The ID of the input within the node.
   */
  inputId: string
}

/**
 * A wire connects a node's output to one or more nodes' inputs.
 */
export type Wire = {
  /**
   * The ID of the node that this wire gets its value from.
   */
  sourceNodeId: string
  /**
   * The ID of the output in the source node that this wire gets its value from.
   */
  sourceOutputId: string
  /**
   * An array of node inputs that receive this wire's value.
   */
  targetInputs: NodeInputRef[]
  /**
   * The current value that's on this wire.
   */
  value: string
}

/**
 * A simulation holds the state of the CPU, as well as all the nodes and wires within it.
 */
export type Simulation = {
  /**
   * The current value of the Program Counter.
   */
  pc: number
  /**
   * The current values of the registers.
   */
  registers: number[]
  /**
   * A record where the key is an address number, and the value is the byte at that address.
   */
  memory: Record<number, number>
  /**
   * A set of all the nodes in the simulation.
   * They do not contain state.
   */
  nodes: Node[]
  /**
   * A set of wires that connect between nodes.
   * Each wire stores the value that's currently on it.
   */
  wires: Wire[]
  /**
   * TODO maybe doesn't have to be a queue
   * A queue(?) of signals that are going to be inputted into a node in the next step.
   */
  queue: (NodeInputRef & { value: number })[]
}

/**
 * Creates a new simulation and returns it.
 */
export function newSimulation(): Simulation {
  const registers: number[] = []

  for (let i = 0; i < MAX_REGISTERS; i++) {
    registers.push(0)
  }

  return {
    pc: 0, // TODO what should be the initial PC?
    memory: {},
    registers,
    nodes: [],
    wires: [],
    queue: [],
  }
}
