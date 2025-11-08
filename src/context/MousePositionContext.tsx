import { createContext, useEffect, useState, type ReactNode } from "react"

type Position = {
  x: number
  y: number
}

type Props = {
  children: ReactNode
}

// eslint-disable-next-line react-refresh/only-export-components
export const MousePositionContext = createContext<Position>({ x: 0, y: 0 })

export function MousePositionProvider({ children }: Props) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      setPosition({ x: e.pageX, y: e.pageY })
    }

    window.addEventListener("mousemove", listener)

    return () => {
      window.removeEventListener("mousemove", listener)
    }
  }, [])

  return (
    <MousePositionContext value={position}>{children}</MousePositionContext>
  )
}
