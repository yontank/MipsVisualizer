import { intToHex } from "@/lib/utils"
import type { Wire } from "@/simulation"
import { type Node, type NodeProps } from "@xyflow/react"
import { FaArrowRightLong } from "react-icons/fa6"

type MuxData = {
  label: string
  inputs: {
    id: string
    visible: boolean
    value: Wire | number
  }[]
  outputs?: { id: string; name: string; visible: boolean }[]
}

export type MuxNode = Node<MuxData, "MuxNode">

export const Mux = ({ data }: NodeProps<MuxNode>) => {
  return (
    <>
      <div className="h-48 w-16 border-2 border-solid border-black rounded-3xl flex items-center  flex-row-reverse">
        <span className="text-left">{data.label}</span>
        <div>
          {}
          {data.inputs
            .filter((e) => e.visible)
            .map((e, i) => {
              return (
                <div className="w-8 h-8 relative">
                  {typeof e.value === "number" ? (
                    <div className="flex gap-1 absolute -left-11.5 justify-center items-center ">
                      <div className="flex flex-row-reverse items-center justify-center gap-1">
                        <FaArrowRightLong />
                        {intToHex(e.value)}
                      </div>
                      <p className="ml-1">{i}</p>
                    </div>
                  ) : (
                    <>Handle!</>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}
