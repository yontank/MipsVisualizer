/// <reference types="vite-plugin-svgr/client" />

import { makeIID, placedNodeId } from "@/logic/simulation"
import { useContext, useEffect, useRef, useState } from "react"
import { MouseTooltip } from "./MouseTooltip"
import { int2hex } from "@/lib/utils"
import ShiftComponent from "@/assets/shift.svg?react"
import { MousePositionContext } from "@/context/MousePositionContext"
import { useSimulationContext } from "@/context/SimulationContext"
import { makeShifter } from "@/logic/nodeTypes/shift"

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
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}) {
  const { placedNodes, setPlacedNodes, simulation } = useSimulationContext()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoveredWire, setHoveredWire] = useState<
    { nodeId: string; inputId: string; bits: number } | undefined
  >(undefined)
  const [isPlacingNode, setIsPlacingNode] = useState(true)

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

  const onDiagramClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (hoveredWire && isPlacingNode && svgRef.current) {
      const { left, top } = svgRef.current.getBoundingClientRect()
      setPlacedNodes(
        new Map([
          ...placedNodes,
          [
            makeIID(hoveredWire.nodeId, hoveredWire.inputId),
            {
              x: e.clientX - left,
              y: e.clientY - top,
              nodeType: makeShifter("left", 2),
            },
          ],
        ]),
      )
      setIsPlacingNode(false)
    }
  }

  let tooltipContent: React.ReactNode | undefined

  if (hoveredWire && simulation) {
    const hoveredWireValue = simulation.inputValues[hoveredWire.nodeId]?.[
      hoveredWire.inputId
    ] as number | undefined

    if (hoveredWireValue != undefined) {
      tooltipContent = int2hex(
        hoveredWireValue,
        Math.ceil(hoveredWire.bits / 4),
      )
      const iid = makeIID(hoveredWire.nodeId, hoveredWire.inputId)
      if (placedNodes.has(iid)) {
        tooltipContent = (
          <div className="grid grid-cols-[auto_auto] grid-rows-2 gap-x-2 items-baseline">
            <span className="text-sm text-muted-foreground">Before: </span>
            {int2hex(
              simulation.inputValues[placedNodeId(iid)].in,
              Math.ceil(hoveredWire.bits / 4),
            )}
            <span className="text-sm text-muted-foreground">After: </span>
            {tooltipContent}
          </div>
        )
      }
    }
  }

  return (
    <>
      <div className="relative">
        <props.svg
          ref={svgRef}
          style={
            hoveredWire && ((simulation && tooltipContent) || isPlacingNode)
              ? {
                  [strokeCSSVariable(hoveredWire.nodeId, hoveredWire.inputId)]:
                    "2px",
                }
              : undefined
          }
          onClick={onDiagramClick}
        />
        {[...placedNodes.entries()].map(([id, n]) => (
          <ShiftComponent
            key={id}
            className="absolute pointer-events-none"
            style={{ left: n.x, top: n.y, translate: "-50% -50%" }}
          />
        ))}
      </div>
      {isPlacingNode && (
        <MouseNode svg={ShiftComponent} placeable={!!hoveredWire} />
      )}
      {tooltipContent && <MouseTooltip>{tooltipContent}</MouseTooltip>}
    </>
  )
}
