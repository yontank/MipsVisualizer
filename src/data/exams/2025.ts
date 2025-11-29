import { makeShifter } from "@/logic/nodeTypes/shift"
import type { SimulationTemplate } from "./types"
import { not } from "@/logic/nodeTypes/not"
import { neg } from "@/logic/nodeTypes/neg"

export const Exams2025: Record<string, SimulationTemplate> = {
  "a-94": {
    PCAddr: 0x0000bf70,
    code: "nop\nadd $4,$12,$6\nlw $4,-128($8)\naddi $4,$4,-128\nsw $6,-128($4)",
    registerInit: [
      0, 4096, 8192, 12288, 16384, 20480, 24576, 28672, 32768, 36864, 40960,
      45056, 49152, 53248, 57344, 61440, 65536, 69632, 73728, 77824, 81920,
      86016, 90112, 94208, 98304, 102400, 106496, 110592, 114688, 118784,
      122880, 126976,
    ],
    placedNodes: {
      "registers-readRegister1": {
        x: 409,
        y: 383,
        nodeType: makeShifter("rightLogical", 1),
      },
    },
    lineExecution: 4,
  },

  "a-81": {
    PCAddr: 0xaa00bb08,
    code: "sub $9,$9,$8\nori $9,$9,0x88\nlw $1,0x200($9)\nadd $2,$1,$8\nslt $2,$7,$4",
    registerInit: [
      0, 128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 1408, 1536, 1664,
      1792, 1920, 2048, 2176, 2304, 2432, 2560, 2688, 2816, 2944, 3072, 3200,
      3328, 3456, 3584, 3712, 3840, 3968,
    ],
    placedNodes: {
      "registers-writeData": {
        x: 1033,
        y: 701,
        nodeType: not
      },
    },
    memoryInit: (address) =>
      address < 0x400
        ? 0x17171717
        : address < 0x800
          ? 0x23232323
          : address < 0xc00
            ? 0xfefefefe
            : 0,
    lineExecution: 5,
  },

  "a-87": {
    PCAddr: 0x00004af4,
    code: "addi $3,$0,-2816\nsw $3,0x4000($3)\nlw $2,19200($0)\nslt $4,$3,$2",
    registerInit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    placedNodes: {
      "muxMemToReg-in0": {
        x: 1046,
        y: 648,
        nodeType: neg
      }
    },
    lineExecution: 3
  }
}
