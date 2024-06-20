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
      const includes = stringsToHighlight.includes(textNode.getTextContent())

      if(!includes){
        if (
          textNode
            .getStyle()
            .includes(`color: ${realm.getValue(highlightColor$)}`)
        ) {
          textNode.setStyle(`color: var(--baseTextContrast)`)
        }
        return;
      }

      if(includes){
        stringsToHighlight.forEach((highlightString) => {
          const regex = new RegExp(highlightString, "gi");
          let match;
      
          //Execute loop until we get back a null
          while ((match = regex.exec(textNode.getTextContent())) !== null) {
              const start = match.index;
              const end = start + highlightString.length;
              const [before, highlighted, after] = textNode.splitText(start, end);
  
              if(!highlighted && !after){
                //If the string matches at the begining of the node
                before.setStyle(`color: ${realm.getValue(highlightColor$)}`);
              } else {
                //If the string matches at any other point in the node
                highlighted.setStyle(`color: ${realm.getValue(highlightColor$)}`);
              }
      
              if (after) {
                // Set the text node to the last node. Might not be needed?
                  textNode = after;
              }
          }
        });
      }
    });
  }
});
