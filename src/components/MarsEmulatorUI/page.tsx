"use server"
import { columns, type CompiledMIPS } from "./columns"
import { DataTable } from "./data-table"

// async function getData(): Promise<Payment[]> {
function getData(): CompiledMIPS[] {
  // Fetch data from your API here.
  return [
    {
      id: "",
      address: "0x00400000",
      code: "0x1234567",
      source: "add $6 , $2, $1",
    },
    {
      id: "728ed52f",
      address: "0x00400004",
      code: "0x3C010000",
      source: "sw $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x00400008",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
    {
      id: "728ed52f",
      address: "0x0040000C",
      code: "0x3C010000",
      source: "lui $at, 0x0000",
    },
  ]
}

export default function DemoPage() {
  const data = getData()

  return (
    <div className="container mx-auto py-10 w-[375px]">
      <DataTable
        columns={columns}
        data={data}
        setRowStyle={(row) => {
          const address = row.original.address
          if (address === "0x00400000") return { backgroundColor: "teal" }
          return {}
        }}
      />
    </div>
  )
}
