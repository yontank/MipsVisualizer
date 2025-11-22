import { hex2int, parseHex, type Hexadecimal } from "@/lib/utils"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react"

export function MemoryInput(props: { onSubmit: (value: number) => void }) {
  const [value, setValue] = useState<string>("")

  const handleChange = (keys: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = keys.currentTarget
    return parseHex(value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
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
