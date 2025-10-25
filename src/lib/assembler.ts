const spaceRegex = /[^\S\r\n]/
const digitRegex = /\d/
const wordRegex = /\w/

type Token = {
  kind:
    | "number"
    | "identifier"
    | "register"
    | "instruction"
    | "newline"
    | "comma"
    | "colon"
    | "lparen"
    | "rparen"
    | "eof"
  value: string
  numberValue?: number
}

type Error = {
  kind: "error"
  errorMessage: string
  line: number
}

/**
 * The state of code being assembled.
 */
type CodeState = {
  code: string
  index: number
  line: number
  reachedEnd: boolean
}

/**
 * Everything needed to parse and encode an instruction.
 */
type Instruction = {
  /**
   * The kinds of tokens that this instruction expects.
   */
  syntax: Token["kind"][]
  /**
   * The indices of tokens to take the values of.
   */
  capture: number[]
  /**
   * Encodes the captured parameters into the instruction's machine code.
   * @param operands The values of the captured tokens.
   * @returns The encoded binary instruction, or an error message.
   */
  encode: (operands: number[]) => { error: string } | number
}

type ExecutionRow = {
  address: number
  code: number
  source: string
}

type AssembleResult = {
  kind: "result"
  /**
   * Array of words for the machine code instructions.
   */
  data: number[]
  /**
   * Information that will be shown in the "Execution" table.
   */
  executionInfo: ExecutionRow[]
}

/**
 * Encodes an R-Type instruction.
 * Assumes that all the parameters are not larger than their respective bit widths.
 * @param rs The RS bits.
 * @param rt The RT bits.
 * @param rd The RD bits.
 * @param shamt The SHAMT bits.
 * @param funct The FUNCT bits.
 * @returns The binary code of the instruction.
 */
function encodeRType(
  rs: number,
  rt: number,
  rd: number,
  shamt: number,
  funct: number,
): number {
  return funct | (shamt << 6) | (rd << 11) | (rt << 16) | (rs << 21)
}

const instructions: Record<string, Instruction> = {
  add: {
    syntax: ["register", "comma", "register", "comma", "register"],
    capture: [0, 2, 4],
    encode: (operands) =>
      encodeRType(operands[1], operands[2], operands[0], 0, 0x20),
  },
  sub: {
    syntax: ["register", "comma", "register", "comma", "register"],
    capture: [0, 2, 4],
    encode: (operands) =>
      encodeRType(operands[1], operands[2], operands[0], 0, 0x22),
  },
}

const registerNames = [
  "zero",
  "at",
  "v0",
  "v1",
  "a0",
  "a1",
  "a2",
  "a3",
  "t0",
  "t1",
  "t2",
  "t3",
  "t4",
  "t5",
  "t6",
  "t7",
  "s0",
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "t8",
  "t9",
  "k0",
  "k1",
  "gp",
  "sp",
  "fp",
  "ra",
]

function char(state: CodeState) {
  return state.code[state.index]
}

function advance(state: CodeState) {
  if (state.reachedEnd) {
    return
  }
  if (state.code[state.index] == "\n") {
    state.line++
  }
  state.index++
  if (state.index >= state.code.length) {
    state.reachedEnd = true
  }
}

/**
 * Returns the next token in the code.
 * @param state The state to read from.
 * @returns The token that was read.
 */
function readToken(state: CodeState): Token | Error {
  while (!state.reachedEnd && spaceRegex.test(char(state))) {
    advance(state)
  }

  if (char(state) === "#") {
    while (!state.reachedEnd && state.code[state.index] != "\n") advance(state)
  }

  if (state.reachedEnd) {
    return { kind: "eof", value: "" }
  }

  const c = char(state)
  advance(state)
  switch (c) {
    case "\n":
      return { kind: "newline", value: c }
    case ",":
      return { kind: "comma", value: c }
    case ":":
      return { kind: "colon", value: c }
    case "(":
      return { kind: "lparen", value: c }
    case ")":
      return { kind: "rparen", value: c }
  }

  // Read register.
  if (c == "$") {
    let value = ""
    while (!state.reachedEnd && wordRegex.test(char(state))) {
      value += char(state)
      advance(state)
    }

    const numberValue = Number(value)
    if (!isNaN(numberValue)) {
      return {
        kind: "register",
        value,
        numberValue,
      }
    }

    const index = registerNames.indexOf(value)
    if (index >= 0 && index < 32) {
      return {
        kind: "register",
        value,
        numberValue: index,
      }
    }

    return {
      kind: "error",
      errorMessage: "Invalid register name.",
      line: state.line,
    }
  }

  // Read number.
  if (digitRegex.test(c)) {
    let value = c
    while (!state.reachedEnd && wordRegex.test(char(state))) {
      value += char(state)
      advance(state)
    }

    const numberValue = Number(value)
    if (isNaN(numberValue)) {
      return {
        kind: "error",
        errorMessage: "Invalid number.",
        line: state.line,
      }
    }

    return {
      kind: "number",
      value,
      numberValue,
    }
  }

  // Read identifier or instruction.
  if (wordRegex.test(c)) {
    let value = c
    while (!state.reachedEnd && wordRegex.test(char(state))) {
      value += char(state)
      advance(state)
    }

    return {
      kind: instructions[value] ? "instruction" : "identifier",
      value,
    }
  }

  return {
    kind: "error",
    errorMessage: "Invalid character.",
    line: state.line,
  }
}

/**
 * Assembles the given assembly code and returns the resulting machine code,
 * and some extra debug information.
 * @param code The MIPS assembly code to assemble.
 * @param initialPC The address where the program starts.
 * @returns The array of instruction words, or an error message.
 */
export function assemble(
  code: string,
  initialPC: number,
): AssembleResult | Error {
  const state: CodeState = {
    code,
    index: 0,
    line: 1,
    reachedEnd: false,
  }

  const data: number[] = []
  const executionInfo: ExecutionRow[] = []
  let pc = initialPC

  while (!state.reachedEnd) {
    const startIndex = state.index
    const result = readToken(state)
    if (result.kind == "error") {
      return result
    }

    if (result.kind == "instruction") {
      const instruction = instructions[result.value]
      const params: number[] = []
      let tokenIndex = 0

      while (!state.reachedEnd && tokenIndex < instruction.syntax.length) {
        const token = readToken(state)
        if (token.kind == "error") {
          return token
        }
        if (token.kind != instruction.syntax[tokenIndex]) {
          return {
            kind: "error",
            errorMessage: `Invalid instruction syntax. (Expected ${instruction.syntax[tokenIndex]} but got ${token.kind})`,
            line: state.line,
          }
        }
        if (instruction.capture.includes(tokenIndex)) {
          params.push(token.numberValue!)
        }
        tokenIndex++
      }

      if (tokenIndex != instruction.syntax.length) {
        return {
          kind: "error",
          errorMessage: "Invalid instruction syntax.",
          line: state.line,
        }
      }

      const code = instruction.encode(params)
      if (typeof code == "object") {
        return {
          kind: "error",
          errorMessage: code.error,
          line: state.line,
        }
      }
      data.push(code)
      executionInfo.push({
        address: pc,
        code,
        source: state.code.substring(startIndex, state.index).trim(),
      })
      pc += 4

      const next = readToken(state)

      if (next.kind != "newline" && next.kind != "eof") {
        return {
          kind: "error",
          errorMessage: "Expected newline after instruction.",
          line: state.line,
        }
      }
    }
  }

  return {
    kind: "result",
    data,
    executionInfo,
  }
}
