"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SortCodeBlock({
  code,
  title = "handleSort()",
}: {
  code: string;
  title?: string;
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          background: "#1e1e1e",
          color: "#9ca3af",
          fontFamily: "monospace",
          fontSize: 12,
          padding: "8px 14px",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottom: "1px solid #333",
        }}
      >
        {title}
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          fontSize: 13,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
