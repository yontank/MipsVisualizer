import { useState } from "react"
import { ReactFlow } from "@xyflow/react"
import { BlackBoxHardwareNode as RectangleNode } from "./components/electornics/BlackBoxHardwareNode"
import "@xyflow/react/dist/style.css"
import { Mux as MuxNode } from "./components/electornics/Mux"
import { Circle as CircleNode } from "./components/electornics/Circle"
import AdderNode from "@/components/electornics/Adder"
const nodeTypes = {
  Rectangle: RectangleNode,
  Mux: MuxNode,
  Circle: CircleNode,
  Adder: AdderNode,
}

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: -350 },
    type: "Adder",
    data: { label: "YES" },
  },
  {
    id: "n2",
    position: { x: 0, y: 100 },
    data: {
      label: "Register File",
      inputs: [
        { id: "hi", name: "Read Register 1" },
        { id: "", name: "Read Register 2" },
        { id: "", name: "Write Register" },
        { id: "", name: "Write Data" },
      ],
      outputs: [
        { id: "", name: "Read RegData 1" },
        { id: "", name: "Read RegData 2" },
      ],
    },
    type: "Rectangle",
  },
  {
    id: "n3",
    position: { x: 50, y: 0 },
    data: {
      label: "Instruction Memory",
      inputs: [
        { id: "", name: "Read Address", visible: false },
        { id: "", name: "abc", visible: false },
      ],
      outputs: [{ id: "", name: "Instr[31-0]" }],
    },
    type: "Circle",
  },
  {
    id: "n4",
    position: { x: 500, y: 30 },
    data: { label: "Mux", inputs: [{ id: "", value: 9, visible: true }] },
    type: "Mux",
  },
]

function App() {
  const [nodes] = useState(initialNodes)

  return (
    <>
      {/* <ExecutionPanel/> */}
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView />
      </div>
      {/* <ExecutionDisplay/> */}
    </>
  )
}

export default App
