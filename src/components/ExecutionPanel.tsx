import Editor, { useMonaco, type OnMount } from "@monaco-editor/react"
import { useRef, useState } from "react"
import { Button } from "./ui/button"
type IStandaloneCodeEditor = Parameters<OnMount>[0]
// const editorRef = useRef<IStandaloneCodeEditor>(null)
function ExecutionPanel() {
  const [inc, setInc] = useState<number>(0)

  const editorRef = useRef<IStandaloneCodeEditor>(null)
  const monaco = useMonaco()

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    editorRef.current = editor
    editorRef.current.setPosition({ lineNumber: 1, column: 24 })
    editorRef.current.focus()
  }

  if (!editorRef || !monaco) return <>Loading..</>

  return (
    <div className="">
      <Button onClick={() => setInc(inc + 1)} className="z-10">
        hi
      </Button>
      <Editor
        height={"100vh"}
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

// editorRef.current?.createDecorationsCollection([
//   {
//     range: new monaco.Range(inc, 0, inc, 9999),
//     options: {
//       // isWholeLine: true,
//       // inlineClassName: "inlineHighlight",
//       blockClassName: "inlineHighlight",
//       blockPadding: [0, 14, 0, 0],
//       // linesDecorationsClassName: "inlineHighlight",
//       // afterContentClassName: "inlineHighlight",
//       // lineNumberClassName: "inlineHighlight",
//       stickiness:
//         monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
//     },
//   },
// ])
