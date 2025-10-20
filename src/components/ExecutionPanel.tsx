import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { useRef } from "react";
type IStandaloneCodeEditor = Parameters<OnMount>[0];

function ExecutionPanel() {
  // todo: some work her needs to be done.

  const editorRef = useRef<IStandaloneCodeEditor>(null);

  function handleEditorDidMount(editor: IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    // editor.getModel

    /** Highlight specific Lines */

    editor.createDecorationsCollection([
      {
        range: new monaco.Range(1, 3, 1, 10),
        options: {
          isWholeLine: true,
          inlineClassName: "inlineHighlight"
        },
      },
    ]);
  }

  return (
    <div className="">
      {/* <button onClick={showValue} /> */}
      <Editor
        height={"100vh"}
        width={"450px"}
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
  );
}

export default ExecutionPanel;
