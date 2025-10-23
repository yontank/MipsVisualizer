import { adder } from "../nodeTypes/adder"
import { instructionMemory } from "../nodeTypes/instructionMemory"
import { joiner } from "../nodeTypes/joiner"
import { makeMux } from "../nodeTypes/mux"
import { pc } from "../nodeTypes/pc"
import { registerFile } from "../nodeTypes/registerFile"
import { makeShifter } from "../nodeTypes/shift"
import { makeSplitter } from "../nodeTypes/splitter"
import type { Blueprint } from "../simulation"

export const singleCycle: Blueprint = {
  nodes: {
    pc: {
      type: pc,
      cycleBorder: true,
      outputs: {
        out: "splitterPC",
      },
    },
    instructionMemory: {
      type: instructionMemory,
      outputs: {
        instruction: "splitterInstruction",
      },
    },
    registers: {
      type: registerFile,
      outputs: {
        data1: {
          nodeId: "alu",
          inputId: "in0",
        },
        data2: "splitterReadData2",
      },
    },
    splitterReadData2: {
      type: makeSplitter(2),
      outputs: {
        in0: {
          nodeId: "muxALUSrc",
          inputId: "in0",
        },
        in1: {
          nodeId: "dataMemory",
          inputId: "writeData",
        },
      },
    },
    muxALUSrc: {
      type: makeMux(2),
      outputs: {
        out: {
          nodeId: "alu",
          inputId: "in1",
        },
      },
    },
    splitterInstruction: {
      type: makeSplitter(2),
      outputs: {
        out0: "splitterRegFields",
        out1: "jumpSL2",
      },
    },
    jumpSL2: {
      type: makeShifter("left", 2),
      outputs: {
        out: {
          nodeId: "jumpAddressJoiner",
          inputId: "in0",
        },
      },
    },
    jumpAddressJoiner: {
      type: joiner,
      outputs: {
        out: {
          nodeId: "muxJump",
          inputId: "in1",
        },
      },
    },
    splitterPC: {
      type: makeSplitter(2),
      outputs: {
        out0: {
          nodeId: "instructionMemory",
          inputId: "readAddress",
        },
        out1: {
          nodeId: "pcAdder4",
          inputId: "in0",
        },
      },
    },
    pcAdder4: {
      type: adder,
      constantInputs: {
        in1: 4,
      },
      outputs: {
        out: "splitterJump",
      },
    },
    splitterJump: {
      type: makeSplitter(2),
      outputs: {
        out0: "splitterBranch",
        out1: "jumpAddressJoiner",
      },
    },
  },
}
