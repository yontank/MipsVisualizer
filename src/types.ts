export type HWNodeData = {
  label: string
  inputs?: { id: string; name: string; visible: boolean; value?: number }[]
  outputs?: { id: string; name: string; visible: boolean; }[]
  amount?: number /** This is for Mux, showing how many printable values are possible. */
}
