import type { Simulation } from "@/logic/simulation"
import { useEffect, useRef, useState } from "react"
import { MouseTooltip } from "./MouseTooltip"
import { intToHex } from "@/lib/utils"

/**
 * The stroke width of the duplicate wires for interaction, in pixels.
 */
const INTERACTION_STROKE_WIDTH = 4

export function Diagram(props: {
  simulation?: Simulation
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoveredWire, setHoveredWire] = useState<
    { nodeId: string; inputId: string } | undefined
  >(undefined)

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const current = svgRef.current

    const clones: HTMLElement[] = []
    // Iterate over all the wires, and make a clone that has a thicker stroke width.
    for (const e of current.querySelectorAll<HTMLElement>("[data-input]")) {
      const clone = e.cloneNode(true) as HTMLElement
      clone.style.strokeWidth = INTERACTION_STROKE_WIDTH + "px"
      clone.style.stroke = "transparent"
      clone.id = e.id + "-interact"
      current.appendChild(clone)
      clones.push(clone)

      const nodeId = e.dataset.node!
      const inputId = e.dataset.input!
      clone.addEventListener("mouseover", () => {
        setHoveredWire({ nodeId, inputId })
      })
      clone.addEventListener("mouseleave", () => {
        setHoveredWire(undefined)
      })
    }

    return () => {
      for (const e of clones) {
        current.removeChild(e)
      }
    }
  }, [])

  const hoveredWireValue =
    hoveredWire &&
    props.simulation &&
    props.simulation.inputValues[hoveredWire.nodeId]?.[hoveredWire.inputId]
  const tooltipContent =
    hoveredWireValue != undefined && intToHex(hoveredWireValue)

  return (
    <>
      <props.svg
        ref={svgRef}
        style={
          props.simulation &&
          Object.fromEntries(
            Object.entries(props.simulation.inputValues).flatMap(
              ([nodeId, input]) =>
                Object.keys(input).map((inputId) => [
                  `--${nodeId}-${inputId}`,
                  "red",
                ]),
            ),
          )
        }
      />
      {/* TODO control number of digits based on wire */}
      {tooltipContent ? (
        <MouseTooltip>{tooltipContent}</MouseTooltip>
      ) : undefined}
    </>
  )
}
