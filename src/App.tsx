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
