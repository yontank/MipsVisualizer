import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Hexadecimal } from "@/../types"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function int2hex(number: number, numDigits: number = 8): Hexadecimal {
  if (number < 0) {
    number = 0xffffffff + number + 1
  }

  const hexValue = number.toString(16).toUpperCase()
  const paddedHex = hexValue.padStart(numDigits, "0")
  return ("0x" + paddedHex) as Hexadecimal
}

export function hex2int(x: Hexadecimal) {
  return Number(x)
}

export function intToHex(x: number) {
  if (x < 0) {
    x = 0xffffffff + x + 1
  }

  return "0x" + x.toString(16).toUpperCase()
}

export const parseHex = (value: string) => {
  if (value.length <= 2) return "0x"

  const newChar = value.charAt(value.length - 1)
  // FIXME: can be optomized by if the regex is not fitting, simply do not call the setState function,
  // needs to be checked if its something that needs to be done, (meaning there's some performance issues)
  // if there are, we'll also need to allow special keys (up, down, left, right arrows, enter, space key,etc.)
  if (!newChar.match(/[a-fA-F0-9]/i)) {
    return value.substring(0, value.length - 1)
  }

  return value.slice(0, -1) + newChar.toUpperCase()
}
