import type { Simulation } from "@/simulation"
import { useEffect, useRef, useState } from "react"
import { MouseTooltip } from "./MouseTooltip"

/**
 * The stroke width of the duplicate wires for interaction, in pixels.
 */
const INTERACTION_STROKE_WIDTH = 4

export function Diagram(props: {
  simulation: Simulation
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoveredWire, setHoveredWire] = useState<string[] | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!svgRef.current) {
      return
    }
    const current = svgRef.current
    const clones: HTMLElement[] = []
    // Iterate over all the wires, and make a clone that has a thicker stroke width.
    for (const e of current.querySelectorAll('[id*="."]')) {
      const clone = e.cloneNode(true) as HTMLElement
      clone.style.strokeWidth = INTERACTION_STROKE_WIDTH + "px"
      clone.style.stroke = "transparent"
      clone.id = e.id + "-interact"
      current.appendChild(clone)
      clones.push(clone)
      const wire = e.id.split(".")
      console.log(e.id, wire)
      clone.addEventListener("mouseover", () => {
        setHoveredWire(wire)
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

  return (
    <>
      <props.svg
        ref={svgRef}
        style={Object.fromEntries(
          Object.entries(props.simulation.inputValues).flatMap(
            ([nodeId, input]) =>
              Object.keys(input).map((inputId) => [
                `--${nodeId}-${inputId}`,
                "red",
              ]),
          ),
        )}
      />
      {hoveredWire && (
        <MouseTooltip>
          {props.simulation.inputValues[hoveredWire[0]]?.[hoveredWire[1]]}
        </MouseTooltip>
      )}
    </>
  )
}
