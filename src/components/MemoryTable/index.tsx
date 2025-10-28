/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Hexadecimal } from "types"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useSimulationContext } from "@/context/SimulationContext"
import { int2hex } from "@/lib/utils"
import { useState } from "react"
import { SmileIcon } from "lucide-react"
import { MemoryInput } from "../MemoryInput"

function createMemoryArr(
  index: number,
  VIRT_LIMIT: number,
  memValues: Map<Hexadecimal, Hexadecimal>,
) {
  const result: { address: Hexadecimal; value: Hexadecimal }[] = []

  const low = Math.max(index - VIRT_LIMIT / 2, 0)
  const high = Math.min(index + VIRT_LIMIT / 2, Math.pow(2, 32))

  for (let i = low; i < high; i++) {
    // convert the i address into a hexadecimal value.
    const hexAddr = int2hex(i)

    // if the hexadecimalv value doesn't exist, set its value to 0x0000:0000 (since it's not inside our record, it means its empty)
    if (memValues.has(hexAddr)) {
      //@ts-expect-error we're checking that the value exists above, why would it be undefined?
      result.push({ address: hexAddr, value: memValues.get(hexAddr) })
    } else result.push({ address: hexAddr, value: "0x00000000" })
  }

  return result
}

const emptyArr = createMemoryArr(1, 1024, new Map())
/**
 * TODO: I need a bunch of things here,
 * TODO: 1) on new Memory State, check if i need to create a new array.
 * TODO: 2) if there's a new memory state that is relevant to our memoryArr, re-render it through useSimulationContext re-render.
 * TODO: 3)  I don't think we need to create a setNewArr state, i may be wrong,  but we do need to check how it works.
 *
 */
export function GetTable() {
  const { simulation } = useSimulationContext()
  const [memoryArr, setMemoryArr] = useState<
    {
      address: string
      value: string
    }[]
  >(createMemoryArr(500, 1024, new Map()))

  /** Default Values for the Memory Register */

  const handleSubmit = (value: number) => {
    // setMemoryArr(createMemoryArr(value, 2048 * 8, knownMemValues))
  }

  if (
    simulation == undefined ||
    simulation.memory == undefined ||
    memoryArr == undefined
  )
    return (
      <>
        <MemoryInput onSubmit={handleSubmit} />

        <DataTable
          columns={columns}
          data={emptyArr}
          height="calc(100vh - 130px)"
        />
      </>
    )

  return (
    <>
      <MemoryInput onSubmit={handleSubmit} />

      <DataTable
        columns={columns}
        data={memoryArr}
        height="calc(100vh - 130px)"
      />
    </>
  )
}

export default GetTable
