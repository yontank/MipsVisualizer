import Editor, { useMonaco, type OnMount } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { useImperativeHandle, useState, type Ref } from "react"
import { Input } from "./ui/input"
import { Label } from "@radix-ui/react-label"
import { parseHex } from "@/lib/utils"
import { useSimulationContext } from "@/context/SimulationContext"

/**
 * A generic interface for getting the text of a code editor.
 */
export interface EditorInterface {
  getValue: () => string
}

export function EditorPanel(props: { editorInterface: Ref<EditorInterface> }) {
  //TODO: Change ErrorLine to fit dynamically with Simulation context

  const [decorations, setDecorations] = useState<
    editor.IEditorDecorationsCollection | undefined
  >(undefined)
  const monaco = useMonaco()
  const { pcAddr, setPCAddr, editorRef, error } = useSimulationContext()

  useImperativeHandle(props.editorInterface, () => ({
    getValue: () => editorRef.current!.getValue(),
  }))

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor

    editor.setPosition({ lineNumber: 2, column: 1 })
    editor.focus()
    setDecorations(editor.createDecorationsCollection())
  }

  if (!editorRef || !monaco) return <></>

  decorations?.clear()
  if (error != undefined) {
    decorations?.append([
      {
        range: new monaco.Range(error.line, 1, error.line, 24),
        options: {
          isWholeLine: true,
          blockClassName: "errorVscode",
          blockPadding: [error.line, 0, error.line, 55],
          shouldFillLineOnLineBreak: true,
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      },
    ])
  }

  return (
    <>
      <div>
        <Label className="p-1">Initial PC:</Label>
        <Input
          maxLength={10}
          className="m-1 "
          placeholder="e.g 0x12345678"
          value={pcAddr}
          onChange={(e) => {
            setPCAddr(parseHex(e.currentTarget.value))
          }}
        />
      </div>

      <div>
        <Editor
          height={"calc(100vh - 110px)"}
          width={"375px"}
          defaultLanguage="mips"
          defaultValue={"# Write your code here.\n"}
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
