"use server"
import { columns, type CompiledMIPS } from "./columns"
import { DataTable } from "./data-table"

// async function getData(): Promise<Payment[]> {
function getData(): CompiledMIPS[] {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      address: "0x00400000",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x00400000",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x00400000",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x00400000",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
  ]
}

export default function DemoPage() {
  const data = getData()

  return (
    <div className="container mx-auto py-10 w-[375px]">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
