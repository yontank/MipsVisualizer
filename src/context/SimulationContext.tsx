import type { Simulation } from "@/simulation"
import { createContext } from "react"

type Context = {
  simulation?: Simulation
  /**
   * Compiles the code and starts the simulation.
   */
  startSimulation: () => void
  /**
   * Stops the currently running simulation.
   */
  stopSimulation: () => void
}

export const SimulationContext = createContext<Context>(undefined!)
