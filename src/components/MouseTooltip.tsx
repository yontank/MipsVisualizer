import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Card } from "./ui/card"

/**
 * A tooltip that follows the mouse.
 */
export function MouseTooltip(props: { children: ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      setMousePos({ x: e.screenX, y: e.screenY })
    }
    window.addEventListener("mousemove", listener)
    return () => {
      window.removeEventListener("mousemove", listener)
    }
  }, [])
  return createPortal(
    <Card
      className="w-fit p-2 absolute left-0 top-0"
      style={{ left: mousePos.x, top: mousePos.y }}
    >
      {props.children}
    </Card>,
    document.body,
  )
}
