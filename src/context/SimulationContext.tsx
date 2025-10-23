import type { EditorInterface } from "@/components/EditorPanel"
import { Toaster } from "@/components/ui/sonner"
import { assemble } from "@/lib/assembler"
import { newSimulation, type Simulation } from "@/logic/simulation"
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
   * Stops the currently running simulation.
   */
  stopSimulation: () => void
  error?: { code?: number; line: number; msg: string }

  pcAddr: string
  setPCAddr: React.Dispatch<React.SetStateAction<string>>
}

type Props = {
  children: React.ReactNode
}

const SimulationContext = createContext<Context>(undefined!)

export function SimulationContextProvider({ children }: Props) {
  //TODO: Use Set Simulation to connect it into startSimulation and hte latter
  const [simulation, setSimulation] = useState<Simulation | undefined>(
    undefined,
  )
  /** Customized PC Addresss, (Since in some tests it's changing.) */
  const [pcAddr, setPCAddr] = useState<string>("0x00400000")
  const [error, setError] = useState<
    { code?: number; line: number; msg: string } | undefined
  >(undefined)
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

      // TODO: In Good Compile, do dis PLS PLS PLS
    } else {
      throw Error("how did we get here?")
    }
  }
  const stopSimulation = () => {
    setSimulation(undefined)
    setError(undefined)
  }

  return (
    <SimulationContext
      value={{
        simulation,
        startSimulation,
        stopSimulation,
        error,
        pcAddr,
        setPCAddr,
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
