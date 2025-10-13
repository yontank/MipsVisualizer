import type { HWNodeData } from "@/types"
import { type Node, Position, Handle, type NodeProps } from "@xyflow/react"

export type RectangleNode = Node<HWNodeData, "rectangle">

export const Rectangle = ({ data }: NodeProps<RectangleNode>) => {
  const Inputs = () => {
    {
      return data.inputs?.map((e) => (
        <div className="">
          <Handle
            type="source"
            position={Position.Right}
            id={e.id}
            key={e.id}
          />

          <div className="h-1/2 w-fit pl-1 ">{e.name}</div>
        </div>
      ))
    }
  }

  const Outputs = () => {
    {
      return data.outputs?.map((e) =>
        e.visible ? (
          <div className="">
            <Handle
              type="target"
              position={Position.Right}
              id={e.id}
              key={e.id}
            />

            <div className="h-1/2 w-fit pl-1 ">{e.name}</div>
          </div>
        ) : (
          <></>
        ),
      )
    }
  }

  ;<div className="IM border-2 border-solid w-60 h-60 border-black">
    <h3 className="text-center">{data.label}</h3>

    <div className="flex justify-between items-center h-full overflow-visible">
      {/* Input */}

      <Inputs />
      {/* Outputs */}

      <Outputs />
    </div>
  </div>
}
