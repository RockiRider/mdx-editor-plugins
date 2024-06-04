import {
  BoldItalicUnderlineToggles,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

const Editor = () => {
  return (
    <MDXEditor
      markdown=""
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
