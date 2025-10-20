import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Hexadecimal } from "@/../types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function int2hex(number: number, numDigits: number = 8): Hexadecimal {
  if (number < 0) {
    number = 0xffffffff + number + 1;
  }

  const hexValue = number.toString(16).toUpperCase();
  const paddedHex = hexValue.padStart(numDigits, "0");
  return ("0x" + paddedHex) as Hexadecimal;
}

export function hex2int(x: Hexadecimal) {
  return Number(x);
}
