import { makeShifter } from "@/logic/nodeTypes/shift"
import type { SimulationTemplate } from "./types"

export const Exams2021: Record<string, SimulationTemplate> = {
  "a-82": {
    PCAddr: 0x0000300c,
    code: "sw $10,-0x100(10$)\naddi $10,$10,4\nadd $9,$10,$8\nlw $5,-0x100($10)\nor $3,$5,$10",
    registerInit: [
      0, 1904, 3808, 5712, 7616, 9520, 11424, 13328, 15232, 17136, 19040, 20944,
      22848, 24752, 26656, 28560, 30464, 32368, 34272, 36176, 38080, 39984,
      41888, 43792, 45696, 47600, 49504, 51408, 53312, 55216, 57120, 59024,
    ],
    placedNodes: {
      "alu-in0": {
        x: 673,
        y: 406,
        nodeType: makeShifter("right", 1),
      },
    },
    lineExecution: 1,
  },

  "a-62": {
    PCAddr: 0xad4aff00,
    code: "sw $10,-0x100(10$)\naddi $10,$10,4\nadd $9,$10,$8\nlw $5,-0x100(10$)\nor $3,$5,$10",
    registerInit: [
      0, 1904, 3808, 5712, 7616, 9520, 11424, 13328, 15232, 17136, 19040, 20944,
      22848, 24752, 26656, 28560, 30464, 32368, 34272, 36176, 38080, 39984,
      41888, 43792, 45696, 47600, 49504, 51408, 53312, 55216, 57120, 59024,
    ],
    lineExecution: 1,
  },

  /** NOTE: Register Values Unknown. */
  "a-75": {
    PCAddr: 0x00400000,
    code: "addi $16,$0,10\nlw $11,32(16$)\nor $7,$16,$11\nsub $9,$7,$11\nsw $9,4(16$)\n",
    registerInit: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    placedNodes: {
      "muxMemToReg-in0": {
        x: 987,
        y: 644,
        nodeType: makeShifter("left", 5),
      },
    },
    memoryInit: (address) => (address < 125 ? 0x3d3d3d : 0),
    lineExecution: 3,
  },

  "c-65": {
    PCAddr: 0x000020f4,
    code: "and $13,$7,$8\nlw $10,0x100($6)\nor $12,$6,$10\nbeq $6,$12,2,0xfffffffc",
    registerInit: [
      0, 1536, 3072, 4608, 6144, 7680, 9216, 10752, 12288, 13824, 15360, 16896,
      18432, 19968, 21504, 23040, 24576, 26112, 27648, 29184, 30720, 32256,
      33792, 35328, 36864, 38400, 39936, 41472, 43008, 44544, 46080, 47616,
    ],
    lineExecution: 2,
  },
  "c-92": {
    /**
     * TODO: Modified PC to PC+8 + all shiftLeft2 replaced with shiftLeft3
     *
     */
    PCAddr: 0x00002000,
    code: "sub $9,$8,$9\naddi $8,$9,0x100\naddi $8,$9,0x100\nbeq $1,$2,0x00000005\nlw $9,0x100($8)\nslt $1,$2,$1\nadd $17,$15,$9\nor $2,$6,$11\nsub $10,$4,$9",
    registerInit: [
      0, 272, 288, 304, 320, 336, 352, 368, 384, 400, 416, 432, 448, 464, 480,
      496, 512, 528, 544, 560, 576, 592, 608, 624, 640, 656, 672, 688, 704, 720,
      736, 752,
    ],
    memoryInit: (address) => (address < 0x1000 * 4 ? address / 4 : 0),
    lineExecution: 5,
  },
}
