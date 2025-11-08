/// <reference types="vite-plugin-svgr/client" />

import type { Simulation } from "@/logic/simulation"
import { useContext, useEffect, useRef, useState } from "react"
import { MouseTooltip } from "./MouseTooltip"
import { int2hex } from "@/lib/utils"
import ShiftComponent from "@/assets/shift.svg?react"
import { MousePositionContext } from "@/context/MousePositionContext"

/**
 * The stroke width of the duplicate wires for interaction, in pixels.
 */
const INTERACTION_STROKE_WIDTH = 6

const strokeCSSVariable = (node: string, input: string) => `--${node}-${input}`

function MouseNode(props: {
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  placeable: boolean
}) {
  const mousePos = useContext(MousePositionContext)

  return (
    <props.svg
      className="absolute pointer-events-none"
      style={{
        left: mousePos.x,
        top: mousePos.y,
        translate: "-50% -50%",
        opacity: props.placeable ? 1 : 0.4,
      }}
    />
  )
}

export function Diagram(props: {
  simulation?: Simulation
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoveredWire, setHoveredWire] = useState<
    { nodeId: string; inputId: string; bits: number } | undefined
  >(undefined)
  const [placingNode, setPlacingNode] = useState(true)

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

  let tooltipContent: string | undefined

  if (hoveredWire && props.simulation) {
    const hoveredWireValue =
      props.simulation.inputValues[hoveredWire.nodeId]?.[hoveredWire.inputId]
    tooltipContent = int2hex(hoveredWireValue, Math.ceil(hoveredWire.bits / 4))
  }

  return (
    <>
      <props.svg
        ref={svgRef}
        style={
          hoveredWire && ((props.simulation && tooltipContent) || placingNode)
            ? {
                [strokeCSSVariable(hoveredWire.nodeId, hoveredWire.inputId)]:
                  "2px",
              }
            : undefined
        }
      />
      {placingNode && (
        <MouseNode svg={ShiftComponent} placeable={!!hoveredWire} />
      )}
      <MouseTooltip show={!!tooltipContent}>{tooltipContent}</MouseTooltip>
    </>
  )
}
