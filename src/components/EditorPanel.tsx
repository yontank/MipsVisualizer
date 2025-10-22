import Editor, { type OnMount } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import { useImperativeHandle, useRef, type Ref } from "react"

/**
 * A generic interface for getting the text of a code editor.
 */
export interface EditorInterface {
  getValue: () => string
}

export function EditorPanel(props: { editorInterface: Ref<EditorInterface> }) {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)

  useImperativeHandle(props.editorInterface, () => ({
    getValue: () => editorRef.current!.getValue(),
  }))

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor

    editor.setPosition({ lineNumber: 2, column: 1 })
    editor.focus()
  }

  return (
    <Editor
      height="100%"
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
  )
}
