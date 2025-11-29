import type { SimulationTemplate } from "./types"

export const Exams2023: Record<string, SimulationTemplate> = {
  // TODO: this exam uses a modified diagram (branchImmediateAdder becomes a Sub)
  "a-89": {
    PCAddr: 0x00aa889c,
    code: "lw $9, 0x400($16)\nadd $12,$17,$9\nsub $10,$12,$9\nbeq $9,$8,0xfffffffe",
    registerInit: [
      0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896,
      960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472, 1536, 1600, 1664,
      1728, 1792, 1856, 1920, 1984,
    ],
    memoryInit: (address) => (address < 0x1000 ? address : 0),
    lineExecution: 1,
  },

  // This exam changes too many things for us to implement, so we'll ignore it for now
  //   "a-57": {

  //   }
}
