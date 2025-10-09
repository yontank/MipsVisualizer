import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import { BlackBoxHardwareNode } from "./components/electornics/BlackBoxHardwareNode";
import "@xyflow/react/dist/style.css";
import MuxNode from "./components/electornics/Mux";
import RegMemViewer from "./components/RegMemViewer";

const nodeTypes = {
  RegisterMemory: BlackBoxHardwareNode,
  Mux: MuxNode,
};
// REgisters, Singleton
// control units
const initialNodes = [
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
      // initState : {}
      // state :{}
      // updateState: => []
      // shape: "css"
      // functionality: []
    },
    type: "RegisterMemory",
  },
  {
    id: "n3",
    position: { x: 50, y: 0 },
    data: {
      label: "Instruction Memory",
      inputs: [{ id: "", name: "Read Address" }],
      outputs: [{ id: "", name: "Instr[31-0]" }],
    },
    type: "RegisterMemory",
  },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2"}];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (
      changes: NodeChange<{
        id: string;
        position: { x: number; y: number };
        data: {
          label: string;
          inputs: { id: string; name: string }[];
          outputs: { id: string; name: string }[];
        };
        type: string;
      }>[]
    ) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <>
      {/* <ExecutionPanel/> */}
      {/* <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div> */}
      <RegMemViewer/>
      {/* <ExecutionDisplay/> */}
    </>
  );
}

export default App;
