/// <reference types="vite-plugin-svgr/client" />

import { makeIID, placedNodeId, type NodeType } from "@/logic/simulation"
import { useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { MouseTooltip } from "./MouseTooltip"
import { cn, int2hex } from "@/lib/utils"
import { MousePositionContext } from "@/context/MousePositionContext"
import { useSimulationContext } from "@/context/SimulationContext"
import { X } from "lucide-react"

/**
 * The stroke width of the duplicate wires for interaction, in pixels.
 */
const INTERACTION_STROKE_WIDTH = 6

const strokeCSSVariable = (node: string, input: string) => `--${node}-${input}`

function PlacedNode(props: {
  type: NodeType
  className?: string
  style: React.CSSProperties
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        "absolute p-2 font-bold bg-white border-[2px] border-black rounded-t-[50%_50%] rounded-b-[50%_50%] pointer-events-none select-none whitespace-pre-line",
        props.className,
      )}
      style={{
        translate: "-50% -50%",
        ...props.style,
      }}
    >
      {props.type.label}
      {props.children}
    </div>
  )
}

function MouseNode(props: { type: NodeType; placeable: boolean }) {
  const mousePos = useContext(MousePositionContext)

  return (
    <PlacedNode
      type={props.type}
      style={{
        left: mousePos.x,
        top: mousePos.y,
        opacity: props.placeable ? 1 : 0.4,
      }}
    />
  )
}

export function Diagram(props: {
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}) {
  const {
    placedNodes,
    setPlacedNodes,
    simulation,
    placingNode,
    setPlacingNode,
  } = useSimulationContext()
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

  const onDiagramClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (hoveredWire && placingNode && svgRef.current) {
      const { left, top } = svgRef.current.getBoundingClientRect()
      setPlacedNodes(
        new Map([
          ...placedNodes,
          [
            makeIID(hoveredWire.nodeId, hoveredWire.inputId),
            {
              x: e.clientX - left,
              y: e.clientY - top,
              nodeType: placingNode,
            },
          ],
        ]),
      )
      setPlacingNode(undefined)
    }
  }

  let tooltipContent: React.ReactNode | undefined

  if (hoveredWire && simulation) {
    const hoveredWireValue = simulation.inputValues[hoveredWire.nodeId]?.[
      hoveredWire.inputId
    ] as number | undefined

    if (hoveredWireValue != undefined) {
      const bits =
        simulation.nodes[hoveredWire.nodeId].inputBitWidths?.[
          hoveredWire.inputId
        ] ?? 32
      tooltipContent = int2hex(hoveredWireValue, Math.ceil(bits / 4))
      const iid = makeIID(hoveredWire.nodeId, hoveredWire.inputId)
      if (placedNodes.has(iid)) {
        tooltipContent = (
          <div className="grid grid-cols-[auto_auto] grid-rows-2 gap-x-2 items-baseline">
            <span className="text-sm text-muted-foreground">Before: </span>
            {int2hex(
              simulation.inputValues[placedNodeId(iid)].in,
              Math.ceil(bits / 4),
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
            hoveredWire && ((simulation && tooltipContent) || placingNode)
              ? {
                  [strokeCSSVariable(hoveredWire.nodeId, hoveredWire.inputId)]:
                    "2px",
                }
              : undefined
          }
          onClick={onDiagramClick}
        />
        {[...placedNodes.entries()].map(([id, n]) => (
          <PlacedNode
            key={id}
            className={"group " + (simulation ? "" : "pointer-events-auto")}
            type={n.nodeType}
            style={{ left: n.x, top: n.y, translate: "-50% -50%" }}
          >
            {!simulation && (
              <X
                size={16}
                className="invisible group-hover:visible absolute bg-red-400 p-0.5 rounded-full text-white right-0 top-0 cursor-pointer"
                onClick={() => {
                  const newNodes = new Map(placedNodes)
                  newNodes.delete(id)
                  setPlacedNodes(newNodes)
                }}
              />
            )}
          </PlacedNode>
        ))}
      </div>
      {placingNode && (
        <MouseNode type={placingNode} placeable={!!hoveredWire} />
      )}
      {tooltipContent && <MouseTooltip>{tooltipContent}</MouseTooltip>}
    </>
  )
}
