import type { SimulationTemplate } from "./types"

export const Exams2021: Record<string, SimulationTemplate> = {
  //TODO: this exam uses a modified diagram (signExtend is replaced with shift left 16)
  "a-83": {
    /** Note: This exam sets its register values as UNKNOWN. */
    PCAddr: 0x07700024,
    code: "addi $16,$0,0x44\nsw $17,-0x4($16)\nadd $20,$16,$19\nsub $12,$16,$20\nand $19,$17,$20",
    registerInit: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    placedNodes: {},
    lineExecution: 2,
  },

  "a-89": {
    PCAddr: 0x2855738c,
    code: "lw $11, 256($8)\nadd $7,$11,$11\nsub $9,$7,$12\nsw $9,0(16$)\nbeq $7,$11,0x00000000",
    registerInit: [
      0, 48, 96, 144, 192, 240, 288, 336, 384, 432, 480, 528, 576, 624, 672,
      720, 768, 816, 864, 912, 960, 1008, 1056, 1104, 1152, 1200, 1248, 1296,
      1344, 1392, 1440, 1488,
    ],
    memoryInit: (address) => (address < 1000 ? -address : 0),
    lineExecution: 1,
  },

  "c-83": {
    PCAddr: 0x02d0005c,
    code: "add $6, $7, $8\nlw $6,100($6)\nsub $10,$2,$6\nor $5, $7,$8",
    registerInit: [
      0, 3145728, 6291456, 9437184, 12582912, 15728640, 18874368, 22020096,
      25165824, 28311552, 31457280, 34603008, 37748736, 40894464, 44040192,
      47185920, 50331648, 53477376, 56623104, 59768832, 62914560, 66060288,
      69206016, 72351744, 75497472, 78643200, 81788928, 84934656, 88080384,
      91226112, 94371840, 97517568,
    ],
    lineExecution: 2,
  },
}
