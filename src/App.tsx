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

function App() {
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
      <RegMemViewer />
      {/* <ExecutionDisplay/> */}
    </>
  );
}

export default App;
