import { hex2int, parseHex } from "@/lib/utils"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import type { Hexadecimal } from "types"
import { useState } from "react"

export function MemoryInput(props: { onSubmit: (value: number) => void }) {
  const [value, setValue] = useState<string>("")

  /**
   * TODO: Set state value inside the datatable alone, we dont want to fucking re-render the ENTIRE component when we only need the table to re render(memory)
   * TODO: also, i'd like to add a way to edit the values directly in the table
   * TODO: adding a (onSubmit button) (for the input) so that I'd add a way to submit the input value into the memory table, that way we can update the table without re-rendering the entire component
   * @param keys
   * @returns
   */
  const handleChange = (keys: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = keys.currentTarget
    return parseHex(value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Submit the value
      console.log("Submitting:", value)

      props.onSubmit(hex2int(event.currentTarget.value as Hexadecimal))
    }
  }

  return (
    <div>
      <Label className="p-1">Memory Address</Label>
      <Input
      className="m-1"
        maxLength={8 + 2}
        placeholder="e.g 0x12345678 <Enter>"
        value={value}
        onChange={(e) => setValue(handleChange(e))}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
