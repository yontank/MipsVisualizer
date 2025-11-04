import { NUM_REGISTERS } from "@/constants"
import type { ExecutionRow } from "@/lib/assembler"

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
   * Information about the compiled code.
   */
  executionInfo: ExecutionRow[]
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
   * The current state of the simulation.
   *
   * During `"rising"`, inputs are propagated from node to node.
   * When there are no more pending nodes, it transitions to "risingFinished"
   *
   * The next step after that, the `"executeFalling"` function will be called for all nodes
   * that have one, after which the state will be `"fallingFinished"`.
   *
   * Afterwards, cycle border nodes will become pending again, transitioning back to `"rising"`.
   */
  state: "rising" | "risingFinished" | "fallingFinished"
  /**
   * The last changes that happened in this simulation.
   */
  lastChanges: SimulationChange[]
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
  typeof target == "string" ? "in" : target.inputId,
]

/**
 * Creates a new simulation and returns it.
 * @param blueprint The blueprint that the simulation should be based on.
 * @param instructionMemory The words for the instruction data.
 * @param initialPC The address where the instruction memory should start from.
 * @param executionInfo The execution info table returned from `assemble`.
 * @param initialRegisters Initial values for the registers.
 */
export function newSimulation(
  blueprint: Blueprint,
  instructionMemory: number[],
  initialPC: number,
  executionInfo: ExecutionRow[],
  initialRegisters?: number[],
): Simulation {
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

  const memory: Record<number, number> = {}
  for (let i = 0; i < instructionMemory.length; i++) {
    memory[initialPC + i * 4] = instructionMemory[i]
  }

  return {
    pc: initialPC,
    executionInfo,
    memory,
    registers:
      initialRegisters ?? Array.from({ length: NUM_REGISTERS }, () => 0),
    nodes,
    cycleBorderNodes,
    inputValues: {},
    pendingNodes: new Set(cycleBorderNodes),
    state: "rising",
    lastChanges: [],
  }
}

function nodeHasAllInputs(simulation: Simulation, nodeId: string): boolean {
  const node = simulation.nodes[nodeId]
  return node.type.inputs.every(
    (input) =>
      input.falling ||
      node.constantInputs?.[input.id] ||
      input.id in simulation.inputValues[nodeId],
  )
}

/**
 * Returns an object containing all of a node's input values.
 */
function getNodeInputs(
  simulation: Simulation,
  nodeId: string,
): Record<string, number> {
  const node = simulation.nodes[nodeId]
  let inputValues = simulation.inputValues[nodeId]
  if (node.constantInputs) {
    inputValues = { ...inputValues, ...node.constantInputs }
  }
  return inputValues
}

export function simulationStep(simulation: Simulation): Simulation {
  if (simulation.state == "rising") {
    const newInputValues: typeof simulation.inputValues = {
      ...simulation.inputValues,
    }
    const newPendingNodes: Set<string> = new Set()

    for (const nodeId of simulation.pendingNodes) {
      const node = simulation.nodes[nodeId]
      if (node.cycleBorder || nodeHasAllInputs(simulation, nodeId)) {
        // If a node has received values for all its inputs, we call its `execute` function
        // and output its values.
        const inputValues = getNodeInputs(simulation, nodeId)

        const outputs = node.type.executeRising(simulation, inputValues)
        for (const outputId in outputs) {
          // Forward each output value to its target input.
          const [targetNodeId, targetInputId] = nodeTarget(
            node.outputs[outputId],
          )
          const value = outputs[outputId]
          newInputValues[targetNodeId] = {
            ...newInputValues[targetNodeId],
            [targetInputId]: value,
          }

          const targetNodeInput = simulation.nodes[
            targetNodeId
          ].type.inputs.find((i) => i.id == targetInputId)

          if (!targetNodeInput) {
            throw new Error(
              `Attempt to forward value to undefined input '${targetInputId}' in node '${targetNodeId}'`,
            )
          }

          if (!targetNodeInput.falling) {
            // We'll add the target node to `pendingNodes` only if the input isn't a `falling` one.
            newPendingNodes.add(targetNodeId)
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
      // A cycle is finished if there are no more pending nodes.
      state: newPendingNodes.size == 0 ? "risingFinished" : "rising",
      lastChanges: [],
    }
  } else if (simulation.state == "risingFinished") {
    // In the `"risingFinished"` step, we call the `executeFalling` function of all nodes that have one.
    const newSimulation: Simulation = {
      ...simulation,
      state: "fallingFinished",
      lastChanges: [],
    }
    for (const nodeId in simulation.nodes) {
      const node = simulation.nodes[nodeId]
      if (node.type.executeFalling) {
        const change = node.type.executeFalling(
          simulation,
          getNodeInputs(simulation, nodeId),
        )
        if (change) {
          if (change.type == "regset") {
            newSimulation.registers = [...newSimulation.registers]
            newSimulation.registers[change.register] = change.value
          } else if (change.type == "memset") {
            newSimulation.memory = {
              ...newSimulation.memory,
              [change.address]: change.value,
            }
          } else if (change.type == "pcset") {
            newSimulation.pc = change.value
          }
          newSimulation.lastChanges.push(change)
        }
      }
    }
    return newSimulation
  } else {
    // In the `"fallingFinished"` step, we make all cycle border nodes pending and transition back to `"rising"`.
    return {
      ...simulation,
      inputValues: {},
      pendingNodes: new Set(simulation.cycleBorderNodes),
      state: "rising",
    }
  }
}
