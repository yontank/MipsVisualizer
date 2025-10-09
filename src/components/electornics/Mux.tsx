import React from "react"
import { type Node } from "@xyflow/react"

export type MuxNodeData = {
  label: string
}

const Trapezoid = () => {
  return (
    <svg width="200" height="120" viewBox="0 0 240 160">
      <polygon
        points="40,100 160,100 180,20 20,20"
        fill="transparent"
        stroke="black"
        strokeWidth="2"
        transform="rotate(-90 100 80)"
      />
      {/* Input */}
      <text x={70} y={50} textAnchor="middle" alignmentBaseline="middle">
        Input 1
      </text>

      <text x={70} y={120} textAnchor="middle" alignmentBaseline="middle">
        Input 2
      </text>

      {/* Output */}

      <text
        x="90"
        y="85"
        textAnchor="middle"
        alignmentBaseline="middle"
        className="fill-black text-sm font-semibold"
      >
        Your Text
      </text>
    </svg>
  )
}

export type BlackBoxNode = Node<MuxNodeData, "MuxNodeData">
function Mux() {
  return <Trapezoid />
}

export default Mux
