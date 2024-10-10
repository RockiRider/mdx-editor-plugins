# mdxe-plugin-highlight

<p align="left">
  <a href="https://www.npmjs.com/package/mdxe-plugin-highlight"><img src="https://img.shields.io/npm/v/mdxe-plugin-highlight" alt="Current NPM version"></a>
  <a href="https://www.npmjs.com/package/mdxe-plugin-highlight"><img src="https://img.shields.io/npm/dm/mdxe-plugin-highlight.svg" alt="Monthly downloads from NPM"></a>
    <a href="https://www.npmjs.com/package/mdxe-plugin-highlight"><img src="https://img.shields.io/npm/dt/mdxe-plugin-highlight.svg" alt="Monthly downloads from NPM"></a>
    <a href="https://www.npmjs.com/package/mdxe-plugin-highlight"><img src="https://img.shields.io/npm/l/mdxe-plugin-highlight" alt="License"></a>
</p>

A plugin to highlight text in the rich text editor view for the [MDX Editor](https://mdxeditor.dev/)

## Installation

```bash
npm install mdxe-plugin-highlight
```

## Usage

```tsx
import { MDXEditor, diffSourcePlugin } from "@mdxeditor/editor";
import { highlightPlugin } from "mdxe-plugin-highlight";
import "@mdxeditor/editor/style.css";
import { useState } from "react";

const Editor = () => {
  const [value, setValue] = useState("");

  return (
    <MDXEditor
      markdown={value}
      onChange={(newState) => setEditorState(newState)}
      plugins={[
        diffSourcePlugin({
          viewMode: "rich-text",
        }),
        highlightPlugin({
          stringsToHighlight: ["Hello"], // Array of strings to highlight
          highlightColor: "blue", // Color to highlight the text
        }),
      ]}
    />
  );
};
```
