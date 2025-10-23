import { adder } from "../nodeTypes/adder"
import { alu } from "../nodeTypes/alu"
import { aluControl } from "../nodeTypes/aluControl"
import { and } from "../nodeTypes/and"
import { control } from "../nodeTypes/control"
import { dataMemory } from "../nodeTypes/dataMemory"
import { instructionMemory } from "../nodeTypes/instructionMemory"
import { joiner } from "../nodeTypes/joiner"
import { makeMux } from "../nodeTypes/mux"
import { pc } from "../nodeTypes/pc"
import { registerFile } from "../nodeTypes/registerFile"
import { makeShifter } from "../nodeTypes/shift"
import { signExtend } from "../nodeTypes/signExtend"
import { makeSplitter } from "../nodeTypes/splitter"
import { type Blueprint } from "../simulation"

export const singleCycle: Blueprint = {
  nodes: {
    pc: {
      type: pc,
      cycleBorder: true,
      outputs: {
        out: "splitterPC",
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
    instructionMemory: {
      type: instructionMemory,
      outputs: {
        instruction: "splitterInstruction",
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
    splitterInstruction: {
      type: makeSplitter(2, [
        [0, 31],
        [0, 25],
      ]),
      outputs: {
        out0: "splitterRegFields",
        out1: "jumpSL2",
      },
    },
    splitterRegFields: {
      type: makeSplitter(2),
      outputs: {
        out0: "splitterRDImmediate",
        out1: "splitterRT0",
      },
    },
    splitterRDImmediate: {
      type: makeSplitter(2, [
        [11, 15],
        [0, 15],
      ]),
      outputs: {
        out0: {
          nodeId: "muxRegDst",
          inputId: "in1",
        },
        out1: "splitterImmediateALUOp",
      },
    },
    splitterRT0: {
      type: makeSplitter(2, [
        [16, 20],
        [0, 31],
      ]),
      outputs: {
        out0: "splitterRT1",
        out1: "splitterRS",
      },
    },
    splitterRS: {
      type: makeSplitter(2, [
        [21, 25],
        [26, 31],
      ]),
      outputs: {
        out0: {
          nodeId: "registers",
          inputId: "readRegister1",
        },
        out1: "control",
      },
    },
    splitterJump: {
      type: makeSplitter(2, [
        [0, 31],
        [28, 31],
      ]),
      outputs: {
        out0: "splitterBranch",
        out1: {
          nodeId: "jumpAddressJoiner",
          inputId: "in1",
        },
      },
    },
    splitterRT1: {
      type: makeSplitter(2),
      outputs: {
        out0: {
          nodeId: "registers",
          inputId: "readRegister2",
        },
        out1: {
          nodeId: "muxRegDst",
          inputId: "in0",
        },
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
    muxRegDst: {
      type: makeMux(2),
      outputs: {
        out: {
          nodeId: "registers",
          inputId: "writeRegister",
        },
      },
    },
    control: {
      type: control,
      outputs: {
        regDst: {
          nodeId: "muxRegDst",
          inputId: "control",
        },
        jump: {
          nodeId: "muxJump",
          inputId: "control",
        },
        branch: {
          nodeId: "branchAnd",
          inputId: "in0",
        },
        memRead: {
          nodeId: "dataMemory",
          inputId: "controlMemRead",
        },
        memToReg: {
          nodeId: "muxMemToReg",
          inputId: "control",
        },
        aluOp: {
          nodeId: "aluControl",
          inputId: "control",
        },
        memWrite: {
          nodeId: "dataMemory",
          inputId: "controlMemWrite",
        },
        aluSrc: {
          nodeId: "muxALUSrc",
          inputId: "control",
        },
        regWrite: {
          nodeId: "registers",
          inputId: "controlRegWrite",
        },
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
    splitterImmediateALUOp: {
      type: makeSplitter(2, [
        [0, 31],
        [0, 5],
      ]),
      outputs: {
        out0: "signExtend",
        out1: "aluControl",
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
    signExtend: {
      type: signExtend,
      outputs: {
        out: "splitterImmediate32",
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
    splitterImmediate32: {
      type: makeSplitter(2),
      outputs: {
        out0: {
          nodeId: "muxALUSrc",
          inputId: "in1",
        },
        out1: "immediateSL2",
      },
    },
    immediateSL2: {
      type: makeShifter("left", 2),
      outputs: {
        out: {
          nodeId: "branchImmediateAdder",
          inputId: "in1",
        },
      },
    },
    splitterBranch: {
      type: makeSplitter(2),
      outputs: {
        out0: {
          nodeId: "branchImmediateAdder",
          inputId: "in0",
        },
        out1: {
          nodeId: "muxBranchTaken",
          inputId: "in0",
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
    aluControl: {
      type: aluControl,
      outputs: {
        out: {
          nodeId: "alu",
          inputId: "control",
        },
      },
    },
    alu: {
      type: alu,
      outputs: {
        zero: {
          nodeId: "branchAnd",
          inputId: "in1",
        },
        result: "splitterALU",
      },
    },
    branchImmediateAdder: {
      type: adder,
      outputs: {
        out: {
          nodeId: "muxBranchTaken",
          inputId: "in1",
        },
      },
    },
    splitterALU: {
      type: makeSplitter(2),
      outputs: {
        out0: {
          nodeId: "dataMemory",
          inputId: "address",
        },
        out1: {
          nodeId: "muxMemToReg",
          inputId: "in0",
        },
      },
    },
    branchAnd: {
      type: and,
      outputs: {
        out: {
          nodeId: "muxBranchTaken",
          inputId: "control",
        },
      },
    },
    dataMemory: {
      type: dataMemory,
      outputs: {
        readData: {
          nodeId: "muxMemToReg",
          inputId: "in1",
        },
      },
    },
    muxBranchTaken: {
      type: makeMux(2),
      outputs: {
        out: {
          nodeId: "muxJump",
          inputId: "in0",
        },
      },
    },
    muxJump: {
      type: makeMux(2),
      outputs: {
        out: "pc",
      },
    },
    muxMemToReg: {
      type: makeMux(2),
      outputs: {
        out: {
          nodeId: "registers",
          inputId: "writeData",
        },
      },
    },
  },
}
