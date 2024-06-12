import {
  Cell,
  addActivePlugin$,
  // addExportVisitor$,
  // addImportVisitor$,
  realmPlugin,
  markdown$,
  Signal,
  map,
  activeEditor$,
  // rootEditor$,
  // setMarkdown$,
  // insertDecoratorNode$,
} from "@mdxeditor/editor";
import {} from // HighlightedTextNode,
// LexicalHighlightVisitor,
// MdastHighlightVisitor,
"./visitors";
import { TextNode } from "lexical";

const stringsToHighlight$ = Cell<ReadonlyArray<string>>([]);
const highlightColor$ = Cell<string>("red");

const entry$ = Signal<string>((r) => {
  const transform = r.transformer(
    map((str: string) => {
      if (str.includes("Hello")) {
        return "Hello World";
      }
      return str;
    })
  );
  const transformMarkdown$ = transform(markdown$);
  r.link(entry$, transformMarkdown$);
});

// const highlightedMarkdown$ = Cell<string>("");
// const isHighlighting$ = Cell<boolean>(false);

type HighlightPluginOptions = {
  stringsToHighlight: string[];
  highlightColor: string;
};

export const highlightPlugin = realmPlugin<HighlightPluginOptions>({
  init(realm, options): void {
    console.log("Init");
    realm.pubIn({
      [addActivePlugin$]: "text-highlight",
      // [addImportVisitor$]: [MdastHighlightVisitor],
      // [addExportVisitor$]: [LexicalHighlightVisitor],
    });
  },
  update(realm, options): void {
    //Nothing to do here yet?
    realm.pub(stringsToHighlight$, options?.stringsToHighlight ?? []);
    realm.pub(highlightColor$, options?.highlightColor ?? "red");

    const stringsToHighlight = realm.getValue(stringsToHighlight$);

    const currentEditor = realm.getValue(activeEditor$);
    if (!currentEditor) {
      return;
    }
    currentEditor.registerNodeTransform(TextNode, (textNode) => {
      // This transform runs twice but does nothing the first time because it doesn't meet the preconditions
      console.log(textNode.getTextContent());
      if (
        textNode
          .getStyle()
          .includes(`color: ${realm.getValue(highlightColor$)}`)
      ) {
        console.log("Already highlighted");
        return;
      }
      if (
        stringsToHighlight.some((highlightString) => {
          const regex = new RegExp(highlightString, "gi");
          return regex.test(textNode.getTextContent());
        })
      ) {
        textNode.setStyle(`color: ${realm.getValue(highlightColor$)}`);
      }
    });
  },
});
