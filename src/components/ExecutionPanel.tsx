import Editor, { type OnMount } from "@monaco-editor/react"
import { useRef } from "react"
type IStandaloneCodeEditor = Parameters<OnMount>[0]

function ExecutionPanel() {
  const editorRef = useRef<IStandaloneCodeEditor>(null)

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor

    editor.setPosition({ lineNumber: 2, column: 1 })
    editor.focus()
  }

  if (!editorRef) return <></>

  return (
    <div className="">
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
  )
}

export default ExecutionPanel
