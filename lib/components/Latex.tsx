"use client";

import { InlineMath, BlockMath } from "react-katex";

interface LatexProps {
  children: string;
}

// Renders text that may contain $...$ (inline) or $$...$$ (block) LaTeX.
// Non-math text passes through as plain text.
export default function Latex({ children }: LatexProps) {
  // Split on $$...$$ first (block), then $...$ (inline)
  const blockParts = children.split(/(\$\$[^$]+\$\$)/g);

  return (
    <>
      {blockParts.map((block, i) => {
        if (block.startsWith("$$") && block.endsWith("$$")) {
          return <BlockMath key={i} math={block.slice(2, -2)} />;
        }
        // Process inline math within this non-block segment
        const inlineParts = block.split(/(\$[^$]+\$)/g);
        return (
          <span key={i}>
            {inlineParts.map((part, j) => {
              if (part.startsWith("$") && part.endsWith("$")) {
                return <InlineMath key={j} math={part.slice(1, -1)} />;
              }
              return <span key={j}>{part}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}