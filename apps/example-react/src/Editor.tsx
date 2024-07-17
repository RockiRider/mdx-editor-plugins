import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertTable,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { highlightPlugin } from "mdxe-plugin-highlight";
import "@mdxeditor/editor/style.css";
import { useState } from "react";

const Editor = () => {
  const [editorState, setEditorState] = useState<string>("");

  const handleGetState = () => {
    console.log(editorState);
  };

  return (
    <div style={{ backgroundColor: "#FFF" }}>
      <MDXEditor
        markdown={editorState}
        onChange={(newState) => setEditorState(newState)}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          tablePlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({
            viewMode: "rich-text",
          }),
          thematicBreakPlugin(),
          highlightPlugin({
            stringsToHighlight: ["Hello"],
            highlightColor: "blue",
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <CreateLink />
                <CodeToggle />
                <InsertTable />
              </>
            ),
          }),
        ]}
      />
      <button onClick={handleGetState}>Get State</button>
    </div>
  );
};

export default Editor;
