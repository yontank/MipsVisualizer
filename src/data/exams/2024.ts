import { not } from "@/logic/nodeTypes/not"
import type { SimulationTemplate } from "./types"
import { makeShifter } from "@/logic/nodeTypes/shift"

export const Exams2024: Record<string, SimulationTemplate> = {
  "c-93": {
    PCAddr: 0xaa573818,
    code: "ori $9,$30,0x4000\n lw  $9,0x100($18)\nor  $4,$9,$9 \nslt $5,$8,$6 \n",
    registerInit: [
      0, 592, 1184, 1776, 2368, 2960, 3552, 4144, 4736, 5328, 5920, 6512, 7104,
      7696, 8288, 8880, 9472, 10064, 10656, 11248, 11840, 12432, 13024, 13616,
      14208, 14800, 15392, 15984, 16576, 17168, 17760, 18352,
    ],
    placedNodes: {
      "registers-readRegister1": {
        x: 409,
        y: 383,
        nodeType: makeShifter("rightLogical", 1),
      },
    },
    memoryInit: (address) =>
      address < 2500
        ? 0xdededede
        : address < 5000
          ? 0xfcfcfcfc
          : address < 7500
            ? 0x575757
            : 0,
    lineExecution: 3,
  },

  "a-91": {
    PCAddr: 0x0acd8080,
    code: "add $2,$2,$2 \nsub $2,$2,$1\nlw  $3,0x2000($2)\n sub $30,$3,$2",
    registerInit: [
      0, 4194304, 8388608, 12582912, 16777216, 20971520, 25165824, 29360128,
      33554432, 37748736, 41943040, 46137344, 50331648, 54525952, 58720256,
      62914560, 67108864, 71303168, 75497472, 79691776, 83886080, 88080384,
      92274688, 96468992, 100663296, 104857600, 109051904, 113246208, 117440512,
      121634816, 125829120, 130023424,
    ],
    placedNodes: {
      "splitterReadData2-in": {
        x: 661,
        y: 468,
        nodeType: makeShifter("left", 3),
      },
    },
    lineExecution: 2,
  },

  "c-84": {
    PCAddr: 0x00001020,
    code: "and $5,$4,$4\nor $9,$3,$3\nlw $5,0x1024($9)\nsw $5,0x1028($9)\nslt $9,$5,$3",
    registerInit: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    placedNodes: {
      "alu-in0": {
        x: 673,
        y: 406,
        nodeType: not,
      },
    },
  },
}
