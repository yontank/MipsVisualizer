"use client"

import { type ColumnDef } from "@tanstack/react-table"
import type { Hexadecimal } from "types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CompiledMIPS = {
  id: string
  address: Hexadecimal
  code: Hexadecimal
  source: string
}

export const columns: ColumnDef<CompiledMIPS>[] = [
  {
    id: "id",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as Hexadecimal

      return (
        <div>{address}</div>
        // </div>
      )
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as Hexadecimal
      return <div>{code}</div>
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string
      return <div>{source}</div>
    },
  },
]
