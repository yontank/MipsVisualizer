import type { Simulation } from "@/logic/simulation"
import { useEffect, useRef, useState } from "react"
import { MouseTooltip } from "./MouseTooltip"
import { int2hex } from "@/lib/utils"

/**
 * The stroke width of the duplicate wires for interaction, in pixels.
 */
const INTERACTION_STROKE_WIDTH = 6

const strokeCSSVariable = (node: string, input: string) => `--${node}-${input}`

export function Diagram(props: {
  simulation?: Simulation
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoveredWire, setHoveredWire] = useState<
    { nodeId: string; inputId: string; bits: number } | undefined
  >(undefined)

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const current = svgRef.current

    const clones: HTMLElement[] = []
    // Iterate over all the wires, and make a clone that has a thicker stroke width.
    for (const e of current.querySelectorAll<HTMLElement>("[data-input]")) {
      const nodeId = e.dataset.node!
      const inputId = e.dataset.input!
      e.style.strokeWidth = `var(${strokeCSSVariable(nodeId, inputId)}, inherit)`
      e.style.transition = "stroke-width 0.25s"

      const clone = e.cloneNode(true) as HTMLElement
      clone.style.strokeWidth = INTERACTION_STROKE_WIDTH + "px"
      clone.style.visibility = "hidden"
      clone.style.pointerEvents = "painted"
      clone.id = e.id + "-interact"
      for (const child of clone.querySelectorAll<HTMLElement>("*")) {
        child.style.removeProperty("stroke-width")
      }
      current.appendChild(clone)
      clones.push(clone)

      const bits = Number(e.dataset.bits ?? "32")

      clone.addEventListener("mouseover", () => {
        setHoveredWire({ nodeId, inputId, bits })
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
    hoveredWireValue != undefined &&
    int2hex(hoveredWireValue, Math.ceil(hoveredWire!.bits / 4))

  return (
    <>
      <props.svg
        ref={svgRef}
        style={
          (props.simulation &&
            hoveredWire &&
            tooltipContent && {
              [strokeCSSVariable(hoveredWire.nodeId, hoveredWire.inputId)]:
                "2px",
            }) ||
          undefined
        }
      />
      {tooltipContent ? (
        <MouseTooltip>{tooltipContent}</MouseTooltip>
      ) : undefined}
    </>
  )
}
