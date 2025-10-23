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
       * The new value at the address.
       */
      value: number
    }
  | {
      type: "pcset"
      /**
       * The new address to set the PC to.
       */
      value: number
    }

type InputList = readonly {
  /**
   * A string that uniquely identifies this input in this node.
   */
  id: string
  /**
   * If true, this input will not have to wait for a value for the node to output a value during rising clock.
   */
  falling?: true
}[]

type OutputList = Record<number, string>

type InputObject<List extends InputList> = { [I in List[number]["id"]]: number }

export type OutputObject<List extends OutputList> = {
  [O in List[number]]: number
}

type ExecuteRisingFunction<Outputs extends OutputList> = (
  simulation: Simulation,
  inputs: Record<string, number>,
) => OutputObject<Outputs>

type ExecuteFallingFunction = (
  simulation: Simulation,
  inputs: Record<string, number>,
) => SimulationChange | undefined

/**
 * An object describing a node - its inputs, outputs and behavior.
 */
export type NodeType<Outputs extends OutputList = OutputList> = {
  /**
   * A map of the inputs this node has.
   */
  inputs: InputList

  /**
   * This function is called during the rising part of the clock cycle.
   * It receives a simulation and its inputs, and must return its outputs.
   * @param simulation The simulation that the node is in.
   * @param inputs An object containing the values of all inputs.
   * @returns An object with the node's outputs.
   */
  executeRising: ExecuteRisingFunction<Outputs>

  /**
   * This function is called during the falling part of the clock cycle.
   * The simulation and inputs of the node are given. The node may update the simulation's state here.
   * @param simulation The simulation that the node is in.
   * @param inputs An object containing the values of all inputs.
   */
  executeFalling?: ExecuteFallingFunction
}

/**
 * Creates a new node type.
 *
 * (The only reason this function exists is because TypeScript can infer generics better when they're parameters in a function,
 * and because force-casting with `as` is easier)
 *
 * @param inputs List of inputs that this node receives.
 * @param executeRising Function that will get called in the rising clock cycle, when the node has values for all its inputs.
 * @param executeFalling An optional function that will be called during the falling clock cycle.
 */
export function nodeType<Outputs extends OutputList, Inputs extends InputList>(
  inputs: Inputs,
  executeRising: (
    simulation: Simulation,
    inputs: InputObject<Inputs>,
  ) => OutputObject<Outputs>,
  executeFalling?: (
    simulation: Simulation,
    inputs: InputObject<Inputs>,
  ) => SimulationChange | undefined,
): NodeType<Outputs> {
  return {
    inputs,
    executeRising: executeRising as ExecuteRisingFunction<Outputs>,
    executeFalling: executeFalling as ExecuteFallingFunction,
  }
}

/**
 * A reference to a node's input.
 *
 * If it's a string, that string is the node's input, and the input ID is assumed to be "in".
 * Otherwise, it's an object with a node ID and an input ID.
 */
type NodeInputTarget =
  | {
      /**
       * The ID of the node.
       */
      nodeId: string
      /**
       * The ID of the input within the node.
       */
      inputId: string
    }
  | string

/**
 * A definition of a node that will be in a simulation.
 */
export type NodeDef<Outputs extends OutputList = OutputList> = {
  /**
   * This node's type.
   */
  type: NodeType<Outputs>
  /**
   * A map where the key is the node's output ID, and the value is where to output to.
   *
   * The input target can be an object describing a node and an input ID, or just a string,
   * in which case it'll output to that node with the inputID "in".
   */
  outputs: Record<Outputs[number], NodeInputTarget>
  /**
   * A map of constant values that should be fed into this node's inputs.
   */
  constantInputs?: Record<string, number>
  /**
   * Indicates whether this node is where a cycle ends.
   *
   * With each simulation step, values are propagated to every node that _isn't_ a cycle border.
   * When a pending input reaches a cycleBorder, values will not propagate from it until the next cycle begins.
   */
  cycleBorder?: boolean
}

/**
 * An instance of a node in a simulation.
 *
 * It includes an `inputs` object which allows mapping an input to the output that's connected to it.
 */
export type Node<
  Inputs extends InputList = InputList,
  Outputs extends OutputList = OutputList,
> = NodeDef<Outputs> & {
  /**
   * A map where the key is the node's input ID, and the value is the node and output ID that it's connected to.
   */
  inputs: Record<
    Inputs[number]["id"],
    {
      /**
       * The ID of the node.
       */
      nodeId: string
      /**
       * The ID of the output within the node.
       */
      outputId: string
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
  memory: Record<number, number | undefined>
  /**
   * A set of all the nodes in the simulation, where the key is the node ID and the value is the node.
   * They do not contain state.
   */
  nodes: Record<string, Node>
  /**
   * An array of node IDs that belong to cycle border nodes.
   */
  cycleBorderNodes: string[]
  /**
   * A map of the values of every node's inputs.
   *
   * The key is a node ID, and the value is a map of which inputId has which value.
   */
  inputValues: Record<string, Record<string, number>>
  /**
   * A set of node IDs, of nodes who have some inputs and are yet to output their value.
   */
  pendingNodes: Set<string>
  /**
   * Whether the current cycle is finished.
   *
   * A cycle is considered finished when the only nodes who have pending inputs are cycle border nodes.
   */
  cycleFinished: boolean
}

/**
 * A blueprint describes a simulation's nodes and their connections.
 */
export type Blueprint = { nodes: Record<string, NodeDef> }

/**
 * Returns the actual nodeId and inputId based on a NodeInputTarget.
 */
const nodeTarget = (
  target: NodeInputTarget,
): [nodeId: string, inputId: string] => [
  typeof target == "string" ? target : target.nodeId,
  typeof target == "string" ? target : target.nodeId,
]

/**
 * Creates a new simulation and returns it.
 */
export function newSimulation(blueprint: Blueprint): Simulation {
  const registers: number[] = []

  for (let i = 0; i < MAX_REGISTERS; i++) {
    registers.push(0)
  }

  const nodes: Record<string, Node> = {}
  const cycleBorderNodes: string[] = []
  for (const nodeId in blueprint.nodes) {
    const node = blueprint.nodes[nodeId]
    nodes[nodeId] = {
      ...node,
      inputs: {},
    }
    if (node.cycleBorder) {
      cycleBorderNodes.push(nodeId)
    }
  }

  // Update the `inputs` map for all the nodes.
  for (const nodeId in nodes) {
    for (const [outputId, target] of Object.entries(nodes[nodeId].outputs)) {
      const [nodeId, inputId] = nodeTarget(target)
      nodes[nodeId].inputs[inputId] = { nodeId, outputId }
    }
  }

  return {
    pc: 0, // TODO what should be the initial PC?
    memory: {},
    registers,
    nodes,
    cycleBorderNodes,
    inputValues: {},
    pendingNodes: new Set(),
    cycleFinished: false,
  }
}

function nodeHasAllInputs(simulation: Simulation, nodeId: string): boolean {
  const node = simulation.nodes[nodeId]
  return node.type.inputs.every(
    (input) => input.id in simulation.inputValues[nodeId],
  )
}

export function simulationStep(simulation: Simulation): Simulation {
  // If the previous step was the end of a cycle, the inputs' values will be cleared.
  const newInputValues: typeof simulation.inputValues = simulation.cycleFinished
    ? {}
    : { ...simulation.inputValues }
  const newPendingNodes: Set<string> = new Set()
  let otherNodesHavePendingInputs = false

  for (const nodeId of simulation.pendingNodes) {
    const node = simulation.nodes[nodeId]
    // Cycle border nodes only propagate their signals if the cycle is finished.
    if (
      (!node.cycleBorder || simulation.cycleFinished) &&
      nodeHasAllInputs(simulation, nodeId)
    ) {
      // If a node has received values for all its inputs, we call its `execute` function
      // and output its values.
      const outputs = node.type.executeRising(
        simulation,
        simulation.inputValues[nodeId],
      )
      for (const outputId in outputs) {
        const [targetNodeId, targetInputId] = nodeTarget(node.outputs[outputId])
        const value = outputs[outputId]
        newInputValues[targetNodeId] = {
          ...newInputValues[targetNodeId],
          [targetInputId]: value,
        }
        newPendingNodes.add(targetNodeId)
        if (!simulation.nodes[targetNodeId].cycleBorder) {
          otherNodesHavePendingInputs = true
        }
      }
    } else {
      newPendingNodes.add(nodeId)
    }
  }

  return {
    ...simulation,
    inputValues: newInputValues,
    pendingNodes: newPendingNodes,
    // A cycle is considered finished if the only nodes who have pending inputs are cycle border nodes.
    cycleFinished: !otherNodesHavePendingInputs,
  }
}
