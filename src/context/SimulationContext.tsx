import type { EditorInterface } from "@/components/EditorPanel"
import { NUM_REGISTERS } from "@/constants"
import { assemble } from "@/lib/assembler"
import { singleCycle } from "@/logic/blueprints/singleCycle"
import {
  newSimulation,
  simulationStep,
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
   * Right Tab value for Editor\Execution.
   */
  rightTabValue: "IDE" | "debugger"
  /**
   * Setter for Editor Tabs (Right side)
   */
  setRightTabValue: React.Dispatch<React.SetStateAction<"IDE" | "debugger">>
  /**
   * Error line controller for toasts, editor highlight
   */
  setError : React.Dispatch<React.SetStateAction<{
    code?: number;
    line: number;
    msg: string;
} | undefined>>
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
  const [rightTabValue, setRightTabValue] = useState<"IDE" | "debugger">("IDE")
  const [initialRegisters, setInitialRegisters] =
    useState<number[]>(zeroRegisters)
  const editorRef = useRef<EditorInterface | undefined>(undefined)

  const startSimulation = () => {
    if (editorRef.current == undefined)
      throw Error("Undefined Reference to the editor")
    const value = editorRef.current.getValue()

    const r = assemble(value, Number(initialPC))

    if (r.kind == "error") {
      setError({ msg: r.errorMessage, line: r.line })

      toast.error("Error in line " + r.line, {
        description: r.errorMessage,
        position: "bottom-left",
      })
    } else if (r.kind == "result") {
      setError(undefined)
      setRightTabValue("debugger")
      setPrevPc(undefined)
      setRunningState({
        index: 0,
        simulations: [
          newSimulation(
            singleCycle,
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
        rightTabValue,
        setRightTabValue,
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
        setError
      }}
    >
      {children}
    </SimulationContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSimulationContext = () => useContext(SimulationContext)
