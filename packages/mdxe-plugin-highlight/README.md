# mdxe-plugin-highlight

[![npm version](https://img.shields.io/npm/v/mdxe-plugin-highlight)](https://www.npmjs.com/package/mdxe-plugin-highlight)
[![npm downloads](https://img.shields.io/npm/dt/mdxe-plugin-highlight)](https://www.npmjs.com/package/mdxe-plugin-highlight)
[![npm license](https://img.shields.io/npm/l/mdxe-plugin-highlight)](https://www.npmjs.com/package/mdxe-plugin-highlight)

A plugin to highlight text in the rich text editor view for the [MDX Editor](https://mdxeditor.dev/)

## Installation

```bash
npm install mdxe-plugin-highlight
```

## Usage

```tsx
import {
  MDXEditor,
  diffSourcePlugin,
} from "@mdxeditor/editor";
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
        />;
    )
}

```
