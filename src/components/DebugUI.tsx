"use client"

import { BugPlayIcon, PlayIcon, SquareIcon, Undo2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useContext } from "react"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip"
import { SimulationContext } from "@/context/SimulationContext"

function DebugUI() {
  const { simulation, startSimulation, stopSimulation } =
    useContext(SimulationContext)

  return (
    <div className="w-fit my-2.5 flex justify-center">
      <ButtonGroup className="cursor-pointer">
        <TooltipProvider>
          <Tooltip delayDuration={800}>
            <TooltipTrigger asChild>
              <ButtonGroup className="">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Go Back"
                  className="hover:text-blue-600 cursor-pointer"
                  disabled={!!simulation}
                  onClick={startSimulation}
                >
                  <BugPlayIcon />
                </Button>
              </ButtonGroup>
            </TooltipTrigger>

            <TooltipContent>
              <p>Compile</p>
            </TooltipContent>
          </Tooltip>

          <ButtonGroup>
            <Tooltip delayDuration={800}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-red-600 cursor-pointer"
                  disabled={!simulation}
                  onClick={() => {
                    stopSimulation()
                  }}
                >
                  <SquareIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>stop</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={800}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-green-600 cursor-pointer"
                  disabled={!simulation}
                >
                  <PlayIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Play</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={800}>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  className="hover:text-red-600 cursor-pointer"
                  disabled={!simulation}
                >
                  <Undo2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>
        </TooltipProvider>
      </ButtonGroup>
    </div>
  )
}

export default DebugUI
