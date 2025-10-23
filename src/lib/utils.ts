import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Hexadecimal } from "@/../types"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 *
 * @param number The given number you want to to show in base16
 * @param numDigits how many 'digits' are in the value
 * @returns a string that is a hexadecimal representation of the number
 */
export function int2hex(number: number, numDigits: number = 8): Hexadecimal {
  if (number < 0) {
    number = 0xffffffff + number + 1
  }

  const hexValue = number.toString(16).toUpperCase()
  const paddedHex = hexValue.padStart(numDigits, "0")
  return ("0x" + paddedHex) as Hexadecimal
}
/**
 * Converts Hex Into Integer
 * @param x Hexadecimal string number
 * @returns An Integer in Base 10 from Base 16
 */
export function hex2int(x: Hexadecimal) {
  return Number(x)
}

/**
 * Given a value string, get the last character and make it fi inside the string for a hexadecimal output.
 * Should be used with onChange component elements.
 * @param value a hexadecimal output
 * @returns a hexadecimal string
 */
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
