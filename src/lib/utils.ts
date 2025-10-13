import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function intToHex(x: number) {
  if (x < 0) {
    x = 0xffffffff + x + 1
  }

  return "0x" + x.toString(16).toUpperCase()
}
