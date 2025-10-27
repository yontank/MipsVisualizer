import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<{ address: string; value: string }>[] = [
  {
    accessorKey: "address",
    header: "Address",
    size: 50,
  },
  {
    accessorKey: "value",
    header: "Value",
    size: 50,
  },
]
