"use client"

import type { ExecutionRow } from "@/lib/assembler"
import { int2hex } from "@/lib/utils"
import { type ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ExecutionRow>[] = [
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = int2hex(row.getValue("address"))

      return <div>{address}</div>
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = int2hex(row.getValue("code"))
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
