/**
 * The number of registers in the CPU.
 */
export const MAX_REGISTERS = 32

/**
 * A change that a node may want to make to a simulation's state.
 */
export type SimulationChange =
  | {
      type: "regset"
      /**
       * The index of the register to change.
       */
      register: number
      /**
       * The new value of the register.
       */
      value: number
    }
  | {
      type: "memset"
      /**
       * The memory address to change.
       */
      address: number
      /**
       * The new value at that address.
       */
      value: number
    }

// TODO figure out a way to statically type node input IDs and the `inputs` parameter in `execute`
/**
 * An object describing a node - its inputs, outputs, behavior and style.
 */
export type NodeType = {
  /**
   * An array of the inputs this node has.
   */
  inputs: {
    /**
     * A string that uniquely identifies this input in this node.
     */
    id: string
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
  }[]

  /**
   * This function is called during the rising part of the clock cycle.
   * It receives a simulation and its inputs, and must return its outputs.
   * @param simulation The simulation that the node is in.
   * @param inputs An object containing the values of all inputs.
   * @returns An object with the node's outputs.
   */
  executeRising: (
    simulation: Simulation,
    inputs: Record<string, number>,
  ) => Record<string, number>

  /**
   * This function is called during the falling part of the clock cycle.
   * The simulation and inputs of the node are given. The node may update the simulation's state here.
   * @param simulation The simulation that the node is in.
   * @param inputs An object containing the values of all inputs.
   */
  executeFalling?: (
    simulation: Simulation,
    inputs: Record<string, number>,
  ) => SimulationChange | undefined
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
  /**
   * A map where the key is the node's output ID, and the value is the node and input ID that it's connected to.
   */
  connections: Record<
    string,
    {
      /**
       * The ID of the node.
       */
      nodeId: string
      /**
       * The ID of the input within the node.
       */
      inputId: string
    }
  >
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
   * A set of all the nodes in the simulation, where the key is the node ID and the value is the node.
   * They do not contain state.
   */
  nodes: Record<string, Node>
  /**
   * A map of input values that are waiting to get accepted into a node.
   *
   * The key is a node ID, and the value is a map of which inputId received which value.
   */
  pendingInputs: Record<string, Record<string, number>>
}

/**
 * Creates a "splitter" node type - a node that just forwards its input to all its outputs.
 * @param numOutputs The number of outputs that the node will have.
 */
export function makeSplitter(numOutputs: number): NodeType {
  const outputs: NodeType["outputs"] = []
  for (let i = 0; i < numOutputs; i++) {
    outputs.push({
      id: "out" + i,
    })
  }

  return {
    inputs: [
      {
        id: "in",
      },
    ],
    outputs,
    executeRising: (_, inputs) => {
      const values: Record<string, number> = {}
      for (const o of outputs) {
        values[o.id] = inputs.in
      }
      return values
    },
  }
}

/**
 * Creates a new simulation and returns it.
 */
export function newSimulation(nodesList: Node[]): Simulation {
  const registers: number[] = []

  for (let i = 0; i < MAX_REGISTERS; i++) {
    registers.push(0)
  }

  const nodes: Record<string, Node> = {}
  for (const node of nodesList) {
    nodes[node.id] = node
  }

  return {
    pc: 0, // TODO what should be the initial PC?
    memory: {},
    registers,
    nodes,
    pendingInputs: {},
  }
}

export function simulationStep(simulation: Simulation): Simulation {
  const newPendingInputs: typeof simulation.pendingInputs = {}
  for (const nodeId in simulation.pendingInputs) {
    const node = simulation.nodes[nodeId]
    const pendingInputs = simulation.pendingInputs[nodeId]
    const hasAllInputs = node.type.inputs.every(
      (input) => input.id in pendingInputs,
    )
    if (hasAllInputs) {
      // If a node has received values for all its inputs, we call its `execute` function
      // and output its values.
      const outputs = node.type.executeRising(simulation, pendingInputs)
      for (const outputId in outputs) {
        const target = node.connections[outputId]
        const value = outputs[outputId]
        newPendingInputs[target.nodeId] = {
          ...newPendingInputs[target.nodeId],
          [target.inputId]: value,
        }
      }
    } else {
      // If a node didn't yet receive values for all its inputs, the existing pending inputs will remain.
      newPendingInputs[nodeId] = {
        ...newPendingInputs[nodeId],
        ...pendingInputs,
      }
    }
  }
  return {
    ...simulation,
    pendingInputs: newPendingInputs,
  }
}
