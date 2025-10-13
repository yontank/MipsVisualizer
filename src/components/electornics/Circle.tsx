import type { HWNodeData } from "@/types"
import { type Node, type NodeProps } from "@xyflow/react"

/**
 * I Want A DataType that is sharable to every hardware Node Type
 */

export type CircleNode = Node<HWNodeData, "Circle">

export const Circle = ({ data }: NodeProps<CircleNode>) => {
  //   const Inputs = () => {
  //     {
  //       return data.inputs?.map((e) => (
  //         <div className="">
  //           <Handle
  //             type="source"
  //             position={Position.Right}
  //             id={e.id}
  //             key={e.id}
  //           />

  //           <div className="h-1/2 w-fit pl-1 ">{e.name}</div>
  //         </div>
  //       ))
  //     }
  //   }

  //   const Outputs = () => {
  //     {
  //       return data.outputs?.map((e) =>
  //         e.visible ? (
  //           <div className="">
  //             <Handle
  //               type="target"
  //               position={Position.Right}
  //               id={e.id}
  //               key={e.id}
  //             />

  //             <div className="h-1/2 w-fit pl-1 ">{e.name}</div>
  //           </div>
  //         ) : (
  //           <></>
  //         ),
  //       )
  //     }
  //   }

  return (
    <>
      <div className="IM border-2 border-solid w-24 h-24 border-black rounded-full flex items-center justify-center ">
        <h3 className="text-center">{data.label}</h3>

        {/* <Inputs /> */}
        {/* <Outputs /> */}
      </div>
    </>
  )
}
