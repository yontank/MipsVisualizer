import Editor, { useMonaco, type OnMount } from "@monaco-editor/react"
import { useEffect, useRef, useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { parseHex as validateHex } from "@/lib/utils"
import { Button } from "./ui/button"
import { editor } from "monaco-editor"
type IStandaloneCodeEditor = Parameters<OnMount>[0]

function ExecutionPanel() {
  const editorRef = useRef<IStandaloneCodeEditor>(null)
  const monaco = useMonaco()
  const [pcValue, setPCValue] = useState("")
  const [errorLine, setErrorLine] = useState<number | undefined>()
  const [decorations, setDecorations] = useState<
    editor.IEditorDecorationsCollection | undefined
  >(undefined)

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor

    editor.setPosition({ lineNumber: 2, column: 1 })
    editor.focus()
    setDecorations(editor.createDecorationsCollection())
  }

  if (!editorRef || !monaco) return <></>

  decorations?.clear()
  
  
  if (errorLine)
    decorations?.append([
      {
        range: new monaco.Range(errorLine, 1, errorLine, 24),
        options: {
          isWholeLine: true,
          blockClassName: "errorVscode",
          blockPadding: [0, 14, 0, 0],
          shouldFillLineOnLineBreak: true,
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      },
    ])
  return (
    <>
      <div>
        <Label className="p-1">Initial PC:</Label>
        <Input
          maxLength={10}
          className="m-1"
          placeholder="e.g 0x12345678"
          value={pcValue}
          onChange={(e) => {
            setPCValue(validateHex(e.currentTarget.value))
          }}
        />
      </div>

      <div>
        <Editor
          height={"calc(100vh - 110px)"}
          width={"375px"}
          defaultLanguage="mips"
          defaultValue="# Write your code here."
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            // readOnly: true,
            minimap: { enabled: false },
            overviewRulerLanes: 0,
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
              handleMouseWheel: false,
            },
          }}
        />
      </div>
    </>
  )
}

export default ExecutionPanel
