import Editor, { useMonaco, type OnMount } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { useEffect, useImperativeHandle, useState, type Ref } from "react"
import { Input } from "./ui/input"
import { Label } from "@radix-ui/react-label"
import { parseHex } from "@/lib/utils"
import { useSimulationContext } from "@/context/SimulationContext"
import { toast, useSonner } from "sonner"

/**
 * A generic interface for getting the text of a code editor.
 */
export interface EditorInterface {
  getValue: () => string
}

const LOCAL_STORAGE_EDITOR_KEY = "editorText"

export function EditorPanel(props: { editorInterface: Ref<EditorInterface> }) {
  const { toasts } = useSonner()

  const [decorations, setDecorations] = useState<
    editor.IEditorDecorationsCollection | undefined
  >(undefined)
  const monaco = useMonaco()
  const { initialPC, setInitialPC, editorRef, error, simulation, setError } =
    useSimulationContext()

  useImperativeHandle(props.editorInterface, () => ({
    getValue: () => editorRef.current!.getValue(),
  }))

  useEffect(() => {
    const onBeforeUnload = () => {
      const { current } = editorRef
      if (current == undefined || current.getValue() == "")
        localStorage.removeItem(LOCAL_STORAGE_EDITOR_KEY)
      else localStorage.setItem(LOCAL_STORAGE_EDITOR_KEY, current.getValue())
    }

    addEventListener("beforeunload", onBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [])

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor

    const editorValue = localStorage.getItem(LOCAL_STORAGE_EDITOR_KEY)

    if (editorValue == null) {
      editor.setPosition({ lineNumber: 2, column: 1 })
    } else {
      editor.getModel()?.setValue(editorValue)
    }
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
          blockPadding: [0, 55, 0, 85],
          shouldFillLineOnLineBreak: true,
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      },
    ])
  }

  const handleChange = () => {
    // When the user is editing his code, we should dismiss the error line \ toast.
    if (error) setError(undefined)
    toasts.forEach((t) => toast.dismiss(t.id))
  }

  return (
    <div className="flex flex-col h-full">
      <Label className="pl-2 pb-2 flex flex-row gap-2 items-baseline">
        Initial PC:
        <Input
          maxLength={10}
          className="flex-1"
          placeholder="e.g 0x12345678"
          value={initialPC}
          disabled={!!simulation}
          onChange={(e) => {
            setInitialPC(parseHex(e.currentTarget.value))
          }}
        />
      </Label>

      <Editor
        defaultLanguage="mips"
        defaultValue={"# Write your code here.\n"}
        theme="vs-dark"
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          readOnly: !!simulation,
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
  )
}
