/// <reference types="vite-plugin-svgr/client" />

import { type Node } from "@xyflow/react"
import AdderIcon from "@/assets/adder.svg?react"

export type MuxNodeData = {
  label: string
}

export type AdderNode = Node<MuxNodeData, "MuxNodeData">

const Adder = ({ data }: AdderNode) => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Title */}
      <div className="absolute  text-xl text-black">
        <h1>+</h1>
      </div>

      {/* Input 1 */}
      <div className="absolute top-8 left-12 text-xs text-blue-500">
        <h1>Input 1</h1>
      </div>
      {/* Input 2 */}
      <div className="absolute top-33 left-12 text-xs text-blue-500">
        <h1>Input 2</h1>
      </div>

      {/* Output 1 */}

      <div className="absolute top-22 right-10 text-xs text-red-500">
        <h1>Output</h1>
      </div>
      <AdderIcon fill="none" stroke="blue" className="w-48 h-48" />
    </div>
    // <svg width="200" height="120" viewBox="0 0 240 160">
    //   <polygon
    //     points="40,100 160,100 180,20 20,20"
    //     fill="transparent"
    //     stroke="black"
    //     strokeWidth="2"
    //     transform="rotate(-90 100 80)"
    //   />
    //   {/* Input */}
    //   <text x={70} y={50} textAnchor="middle" alignmentBaseline="middle">
    //     Input 1
    //   </text>

    //   <text x={70} y={120} textAnchor="middle" alignmentBaseline="middle">
    //     Input 2
    //   </text>

    //   {/* Output */}

    //   <text
    //     x="90"
    //     y="85"
    //     textAnchor="middle"
    //     alignmentBaseline="middle"
    //     className="fill-black text-sm font-semibold"
    //   >
    //     Your Text
    //   </text>
    // </svg>
  )
}

export default Adder
