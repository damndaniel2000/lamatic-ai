import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

interface CodeEditorProps {
  value: string;
  maxRows: number;
  onValueChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value = "//write code here",
  onValueChange,
  maxRows,
}) => {
  const lineHeight = 20; // Approximate line height
  const maxHeight = maxRows * lineHeight + 16;
  return (
    <div
      id="editorDiv"
      className="border rounded-md"
      style={{ maxHeight, overflowY: "auto" }}
    >
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={(code) =>
          highlight(code, languages.javascript, "javascript")
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          lineHeight: `${lineHeight}px`,
        }}
      />
    </div>
  );
};

export default CodeEditor;
