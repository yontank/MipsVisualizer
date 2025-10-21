import Editor, { type OnMount } from "@monaco-editor/react"
import { type editor } from "monaco-editor"
import { useRef } from "react"

function EditorPanel() {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)

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

export default EditorPanel
