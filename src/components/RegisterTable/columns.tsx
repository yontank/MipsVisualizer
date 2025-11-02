import type { CSSProperties } from "react"

export type tableData = {
  values: string[][]
  setRowStyle: (row: string[]) => CSSProperties | undefined
}
