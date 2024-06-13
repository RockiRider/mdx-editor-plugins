import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertTable,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
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
import { useRef } from "react";

const Editor = () => {
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const handleGetState = () => {
    console.log(editorRef.current?.getMarkdown());
  };

  const insertStartingText = () => {
    editorRef.current?.setMarkdown(`Hello World`);
  };

  return (
    <div style={{backgroundColor: "#FFF"}}>
      <MDXEditor
        ref={editorRef}
        markdown=""
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
      <button onClick={insertStartingText}>Insert Starting Text</button>
    </div>
  );
};

export default Editor;
