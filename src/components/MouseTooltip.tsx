import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Card } from "./ui/card"

/**
 * A tooltip that follows the mouse.
 */
export function MouseTooltip(props: { children: ReactNode }) {
  // On the first render of this component, a `mousemove` event hasn't fired yet -
  // so we wait for the first mouse movement before showing the component.
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, moved: false })

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      setMousePos({ x: e.pageX, y: e.pageY, moved: true })
    }
    window.addEventListener("mousemove", listener)
    return () => {
      window.removeEventListener("mousemove", listener)
    }
  }, [])

  return mousePos.moved
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
