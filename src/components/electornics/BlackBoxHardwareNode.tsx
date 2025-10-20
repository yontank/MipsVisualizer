import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"

export type BlackBoxData = {
  label: string
  inputs: { id: string; name: string }[]
  outputs: { id: string; name: string }[]
}

export type BlackBoxNode = Node<BlackBoxData, "BlackBoxHardware">

export function BlackBoxHardwareNode({ data }: NodeProps<BlackBoxNode>) {
  return (
    <div className="IM border-2 border-solid w-60 h-60 border-black">
      <h3 className="text-center">{data.label}</h3>

      <div className="flex justify-between items-center h-full overflow-visible">
        {/* Input */}
        <div>
          {data.inputs.map((e) => (
            <div className="relative border-2 border-solid">
              <Handle
                type="source"
                position={Position.Left}
                id={e.id}
                key={e.id}
              />
              <div className="h-1/2 w-fit pl-1 ">{e.name}</div>
            </div>
          ))}
        </div>

        {/* Outputs */}

        <div>
          {data.outputs.map((e) => (
            <div className="relative border-2 border-solid">
              <Handle
                type="target"
                position={Position.Right}
                id={e.id}
                key={e.id}
              />
              <div className="h-1/2 w-fit pl-1 ">{e.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
