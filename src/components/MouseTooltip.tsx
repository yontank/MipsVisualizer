import { useContext, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Card } from "./ui/card"
import { MousePositionContext } from "@/context/MousePositionContext"

/**
 * A tooltip that follows the mouse.
 */
export function MouseTooltip(props: { show: boolean; children: ReactNode }) {
  const mousePos = useContext(MousePositionContext)

  return props.show
    ? createPortal(
        <Card
          className="w-fit p-2 absolute pointer-events-none"
          style={{ left: mousePos.x, top: mousePos.y, translate: "-50% -105%" }}
        >
          {props.children}
        </Card>,
        document.body,
      )
    : undefined
}
