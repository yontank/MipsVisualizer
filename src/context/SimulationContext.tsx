import type { EditorInterface } from "@/components/EditorPanel"
import { NUM_REGISTERS } from "@/constants"
import { assemble } from "@/lib/assembler"
import { singleCycle } from "@/logic/blueprints/singleCycle"
import {
  breakIID,
  getNodeTarget,
  makeIID,
  newSimulation,
  placedNodeId,
  simulationStep,
  type InputID,
  type NodeType,
  type Simulation,
} from "@/logic/simulation"
import {
  createContext,
  useContext,
  useRef,
  useState,
  type RefObject,
} from "react"
import { toast } from "sonner"

export type PlacedNode = {
  /**
   * The X coordinate of the node on the diagram.
   */
  x: number
  /**
   * The Y coordinate of the node on the diagram.
   */
  y: number
  /**
   * The node type that was placed.
   */
  nodeType: NodeType
}

type Context = {
  simulation?: Simulation
  simulationIndex: number | undefined

  editorRef: RefObject<EditorInterface | undefined>

  /**
   * Compiles the code and starts the simulation.
   */
  startSimulation: () => void
  /**
   * Runs a single cycle of the simulation.
   */
  cycleSimulation: () => void
  /**
   * Stops the currently running simulation.
   */
  stopSimulation: () => void
  /**
   * Steps back one cycle.
   */
  undoSimulation: () => void
  error?: { code?: number; line: number; msg: string }

  /**
   * The address where the instruction memory starts.
   */
  initialPC: string
  setInitialPC: React.Dispatch<React.SetStateAction<string>>
  /**
   * Initial Registers before starting a simulation.
   */
  initialRegisters: number[]
  /**
   * Sets the initial registers as a state.
   */
  setInitialRegisters: React.Dispatch<React.SetStateAction<number[]>>
  /**
   * Gets the previous PC.
   */
  prevPc: number | undefined

  /**
   * Map that stores nodes that were placed by the user.
   * Key is node + input ID, and value is the node that's placed on it.
   */
  placedNodes: Map<InputID, PlacedNode>
  setPlacedNodes: (nodes: Map<InputID, PlacedNode>) => void

  /**
   * The node type currently being placed by the user.
   */
  placingNode: NodeType | undefined
  setPlacingNode: React.Dispatch<React.SetStateAction<NodeType | undefined>>

  /**
   * Error line controller for toasts, editor highlight
   */
  setError: React.Dispatch<
    React.SetStateAction<
      | {
          code?: number
          line: number
          msg: string
        }
      | undefined
    >
  >
}

type RunningState = {
  /**
   * Array of all simulation states in sequence.
   */
  simulations: Simulation[]
  /**
   * The index of the currently active state.
   */
  index: number
}

type Props = {
  children: React.ReactNode
}

const SimulationContext = createContext<Context>(undefined!)

const zeroRegisters = Array.from({ length: NUM_REGISTERS }, () => 0)

export function SimulationContextProvider({ children }: Props) {
  const [runningState, setRunningState] = useState<RunningState | undefined>()
  const [initialPC, setInitialPC] = useState<string>("0x00400000")
  const [prevPc, setPrevPc] = useState<number | undefined>()
  const [error, setError] = useState<
    { code?: number; line: number; msg: string } | undefined
  >(undefined)
  const [initialRegisters, setInitialRegisters] =
    useState<number[]>(zeroRegisters)
  const [placedNodes, setPlacedNodes] = useState<Map<InputID, PlacedNode>>(
    new Map(),
  )
  const [placingNode, setPlacingNode] = useState<NodeType | undefined>()
  const editorRef = useRef<EditorInterface | undefined>(undefined)

  const startSimulation = () => {
    if (editorRef.current == undefined)
      throw Error("Undefined Reference to the editor")

    if (isNaN(parseInt(initialPC))) {
      toast.error("Empty Initial PC", {
        position: "bottom-left",
        description: "Please enter a value inside the initial PC input bar.",
      })
      return
    }

    const value = editorRef.current.getValue()

    const r = assemble(value, Number(initialPC))

    if (r.kind == "error") {
      setError({ msg: r.errorMessage, line: r.line })

      toast.error("Error in line " + r.line, {
        description: r.errorMessage,
        position: "bottom-left",
      })
    } else if (r.kind == "result") {
      if (r.data.length == 0) {
        toast.info("No code to run!", {
          description: "Write some code, and then start the simulation.",
          position: "bottom-left",
        })
        return
      }

      setError(undefined)
      setPrevPc(undefined)

      let blueprint = singleCycle
      if (placedNodes.size > 0) {
        // Make a copy of the blueprint, which will contain new and modified nodes.
        blueprint = { nodes: { ...blueprint.nodes } }

        // Iterate over every output of every node in the blueprint.
        for (const [sourceNodeId, sourceNode] of Object.entries(
          blueprint.nodes,
        )) {
          for (const [outputId, target] of Object.entries(sourceNode.outputs)) {
            const iid = makeIID(...getNodeTarget(target))
            if (placedNodes.has(iid)) {
              // If the user placed a node on the input that this output is connected to,
              // we change this node so that it will output to the newly placed node.
              blueprint.nodes[sourceNodeId] = {
                ...sourceNode,
                outputs: {
                  ...sourceNode.outputs,
                  [outputId]: placedNodeId(iid),
                },
              }
            }
          }
        }

        // Add the placed nodes into the blueprint.
        for (const [iid, node] of placedNodes) {
          const [targetNodeId, targetInputId] = breakIID(iid)
          blueprint.nodes[placedNodeId(iid)] = {
            type: node.nodeType,
            outputs: {
              out: {
                nodeId: targetNodeId,
                inputId: targetInputId,
              },
            },
          }
        }
      }

      setRunningState({
        index: 0,
        simulations: [
          newSimulation(
            blueprint,
            r.data,
            Number(initialPC),
            r.executionInfo,
            initialRegisters,
          ),
        ],
      })
    } else {
      throw Error("how did we get here?")
    }
  }

  const setSimulationIndex = (index: number) => {
    if (!runningState) {
      return
    }

    while (index >= runningState.simulations.length) {
      let newSimulation =
        runningState.simulations[runningState.simulations.length - 1]
      do {
        newSimulation = simulationStep(newSimulation)
      } while (newSimulation.state != "fallingFinished")
      runningState.simulations.push(newSimulation)
    }

    runningState.index = index

    setPrevPc(index == 0 ? undefined : runningState.simulations[index - 1].pc)

    setRunningState(runningState)
  }

  const cycleSimulation = () => {
    if (!runningState) {
      return
    }
    setSimulationIndex(runningState.index + 1)
  }

  const stopSimulation = () => {
    setRunningState(undefined)
    setError(undefined)
  }

  const undoSimulation = () => {
    if (!runningState || runningState.index == 0) {
      return
    }
    setSimulationIndex(runningState.index - 1)
  }

  return (
    <SimulationContext
      value={{
        simulation: runningState?.simulations[runningState.index],
        simulationIndex: runningState?.index,
        startSimulation,
        cycleSimulation,
        stopSimulation,
        undoSimulation,
        error,
        initialPC,
        setInitialPC,
        initialRegisters,
        setInitialRegisters,
        prevPc,
        editorRef,
        setError,
        placedNodes,
        setPlacedNodes,
        placingNode,
        setPlacingNode,
      }}
    >
      {children}
    </SimulationContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSimulationContext = () => useContext(SimulationContext)
