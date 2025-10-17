import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type hexadecimal } from "@/../types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function int2hex(number: number): hexadecimal {
  if (number < 0) {
    number = 0xffffffff + number + 1;
  }
  return `0x${number.toString(16).toUpperCase()}`;
}

export function hex2int(x: hexadecimal) {
  return Number(x);
}
