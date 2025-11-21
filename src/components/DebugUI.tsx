import {
  PlayIcon,
  SquareIcon,
  StepBackIcon,
  StepForwardIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip"
import { useSimulationContext } from "@/context/SimulationContext"

/**
 * A Component that Contains Buttons to Start, Stop, the compilation of the program
 * The Component will probably be at the top of the screen.
 * @returns
 */
export function DebugUI() {
  const {
    stopSimulation,
    startSimulation,
    cycleSimulation,
    undoSimulation,
    simulation,
    simulationIndex,
    initialPC,
    placingNode,
  } = useSimulationContext()

  /** Checks if PC Address is outside the scope of the known commands inside executionInfo.
   * calculated by  the amount of commands there are, if its outside of that range,
   * it means we're not inside the ExecutionRow Commands, and we need to let the user know he finished his execution.
   */
  const isPcAddressFinished = () => {
    if (!simulation) return false

    return (
      Number(initialPC) <= simulation.pc &&
      simulation.pc < Number(initialPC) + simulation?.executionInfo.length * 4
    )
  }

  return (
    <div className="absolute left-[50vw] -translate-x-1/2 top-2.5 flex justify-center">
      <TooltipProvider>
        {simulation ? (
          <ButtonGroup>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-red-600 cursor-pointer"
                  disabled={!simulation}
                  onClick={stopSimulation}
                >
                  <SquareIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  className="hover:text-red-600 cursor-pointer"
                  disabled={!simulation || simulationIndex == 0}
                  onClick={undoSimulation}
                >
                  <StepBackIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Cycle</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-green-600 cursor-pointer"
                  disabled={!simulation || !isPcAddressFinished()}
                  onClick={cycleSimulation}
                >
                  <StepForwardIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Cycle</p>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>
        ) : (
          <Button
            variant="outline"
            className="hover:text-blue-600 w-32 cursor-pointer"
            disabled={!!simulation}
            onClick={startSimulation}
          >
            <PlayIcon />
            Start
          </Button>
        )}
      </TooltipProvider>
      <div className="absolute top-10 text-muted-foreground text-nowrap pointer-events-none">
        {placingNode
          ? "Click on a wire to place the node on."
          : simulationIndex != undefined
            ? simulationIndex > 0
              ? "Hover over a wire to see its value."
              : "Go to the next cycle to execute the next instruction."
            : ""}
      </div>
    </div>
  )
}
