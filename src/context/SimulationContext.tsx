import type { EditorInterface } from "@/components/EditorPanel"
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
  error?: { code?: number; line: number; msg: string }

  pcAddr: string
  setPCAddr: React.Dispatch<React.SetStateAction<string>>

  prevPc: number | undefined

  rightTabValue: "IDE" | "debugger"
  setRightTabValue: React.Dispatch<React.SetStateAction<"IDE" | "debugger">>
}

type Props = {
  children: React.ReactNode
}

const SimulationContext = createContext<Context>(undefined!)

export function SimulationContextProvider({ children }: Props) {
  //TODO: Use Set Simulation to connect it into startSimulation and hte latter
  const [simulation, setSimulation] = useState<Simulation | undefined>()
  /** Customized PC Addresss, (Since in some tests it's changing.) */
  const [pcAddr, setPCAddr] = useState<string>("0x00400000")
  const [prevPc, setPrevPc] = useState<number | undefined>()
  const [error, setError] = useState<
    { code?: number; line: number; msg: string } | undefined
  >(undefined)
  const [rightTabValue, setRightTabValue] = useState<"IDE" | "debugger">("IDE")
  const editorRef = useRef<EditorInterface | undefined>(undefined)

  const startSimulation = () => {
    if (editorRef.current == undefined)
      throw Error("Undefined Reference to the editor")
    const value = editorRef.current.getValue()

    const r = assemble(value, Number(pcAddr))

    // TODO: If code not compiled por favor
    if (r.kind == "error") {
      setError({ msg: r.errorMessage, line: r.line })

      toast.error("Error in line " + r.line, {
        description: r.errorMessage,
        position: "bottom-left",
        duration: 4500,
        className: "!bg-red-700 !border-red-400",
        classNames: {
          title: "!text-white",
          description: "!text-white !text-bold",
          icon: "!text-white ",
        },
      })
    } else if (r.kind == "result") {
      setError(undefined)
      setRightTabValue("debugger")
      setPrevPc(undefined)
      setSimulation(
        newSimulation(singleCycle, r.data, Number(pcAddr), r.executionInfo),
      )
    } else {
      throw Error("how did we get here?")
    }
  }

  const cycleSimulation = () => {
    if (!simulation) {
      return
    }
    setPrevPc(simulation.pc)
    let newSimulation = simulation
    do {
      newSimulation = simulationStep(newSimulation)
    } while (newSimulation.state != "fallingFinished")
    setSimulation(newSimulation)
  }

  const stopSimulation = () => {
    setSimulation(undefined)
    setError(undefined)
  }

  return (
    <SimulationContext
      value={{
        rightTabValue,
        setRightTabValue,
        simulation,
        startSimulation,
        cycleSimulation,
        stopSimulation,
        error,
        pcAddr,
        setPCAddr,
        prevPc,
        editorRef,
      }}
    >
      {children}
    </SimulationContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSimulationContext = () => {
  const context = useContext(SimulationContext)

  return context
}
