import { int2hex } from "@/lib/utils"
import { RegisterTable } from "./data-table"
// import { type tableData } from "./columns"
import { useSimulationContext } from "@/context/SimulationContext"

const registerValues = [
  { name: "pc", number: "", value: "0x00000000" },
  { name: "$zero", number: 0, value: "0x00000000" },
  { name: "$at", number: 1, value: "0x0000000" },
  { name: "$v0", number: 2, value: "0x00000000" },
  { name: "$v1", number: 3, value: "0x00000000" },
  { name: "$a0", number: 4, value: "0x00000000" },
  { name: "$a1", number: 5, value: "0x00000000" },
  { name: "$a2", number: 6, value: "0x00000000" },
  { name: "$a3", number: 7, value: "0x00000000" },
  { name: "$t0", number: 8, value: "0x00000000" },
  { name: "$t1", number: 9, value: "0x00000000" },
  { name: "$t2", number: 10, value: "0x00000000" },
  { name: "$t3", number: 11, value: "0x00000000" },
  { name: "$t4", number: 12, value: "0x00000000" },
  { name: "$t5", number: 13, value: "0x00000000" },
  { name: "$t6", number: 14, value: "0x00000000" },
  { name: "$t7", number: 15, value: "0x00000000" },
  { name: "$s0", number: 16, value: "0x00000000" },
  { name: "$s1", number: 17, value: "0x00000000" },
  { name: "$s2", number: 18, value: "0x00000000" },
  { name: "$s3", number: 19, value: "0x00000000" },
  { name: "$s4", number: 20, value: "0x00000000" },
  { name: "$s5", number: 21, value: "0x00000000" },
  { name: "$s6", number: 22, value: "0x00000000" },
  { name: "$s7", number: 23, value: "0x00000000" },
  { name: "$t8", number: 24, value: "0x00000000" },
  { name: "$t9", number: 25, value: "0x00000000" },
  { name: "$k0", number: 26, value: "0x00000000" },
  { name: "$k1", number: 27, value: "0x00000000" },
  { name: "$gp", number: 28, value: "0x00000000" },
  { name: "$sp", number: 29, value: "0x00000000" },
  { name: "$fp", number: 30, value: "0x00000000" },
  { name: "$ra", number: 31, value: "0x00000000" },
]

function Index() {
  const { simulation } = useSimulationContext()

  if (simulation == undefined)
    return (
      <RegisterTable
        titles={Object.keys(registerValues[0])}
        values={registerValues.map((e) => Object.values(e))}
      />
    )

  const modifiedRegArr: Array<{
    name: string
    number: number | string
    value: number | string
  }> = [
    { name: "$zero", number: 0 },
    { name: "$at", number: 1 },
    { name: "$v0", number: 2 },
    { name: "$v1", number: 3 },
    { name: "$a0", number: 4 },
    { name: "$a1", number: 5 },
    { name: "$a2", number: 6 },
    { name: "$a3", number: 7 },
    { name: "$t0", number: 8 },
    { name: "$t1", number: 9 },
    { name: "$t2", number: 10 },
    { name: "$t3", number: 11 },
    { name: "$t4", number: 12 },
    { name: "$t5", number: 13 },
    { name: "$t6", number: 14 },
    { name: "$t7", number: 15 },
    { name: "$s0", number: 16 },
    { name: "$s1", number: 17 },
    { name: "$s2", number: 18 },
    { name: "$s3", number: 19 },
    { name: "$s4", number: 20 },
    { name: "$s5", number: 21 },
    { name: "$s6", number: 22 },
    { name: "$s7", number: 23 },
    { name: "$t8", number: 24 },
    { name: "$t9", number: 25 },
    { name: "$k0", number: 26 },
    { name: "$k1", number: 27 },
    { name: "$gp", number: 28 },
    { name: "$sp", number: 29 },
    { name: "$fp", number: 30 },
    { name: "$ra", number: 31 },
  ].map((e, i) => ({ ...e, value: int2hex(simulation.registers[i]) }))

  modifiedRegArr.unshift({
    name: "pc",
    number: "",
    value: int2hex(simulation.pc),
  })

  return (
    <RegisterTable
      titles={Object.keys(modifiedRegArr[0])}
      values={modifiedRegArr.map((e) => Object.values(e))}
    />
  )
}

export default Index
