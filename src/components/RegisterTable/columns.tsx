import type { CSSProperties } from "react"

export type tableData = {
  titles: string[]
  values: (string | number)[][]
  setRowStyle? : (row : (string | number)[]) => CSSProperties
}
