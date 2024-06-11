import {
  Cell,
  addActivePlugin$,
  addExportVisitor$,
  addImportVisitor$,
  realmPlugin,
  markdown$,
  Signal,
  map,
  rootEditor$,
  activeEditor$,
  // rootEditor$,
  // setMarkdown$,
  // insertDecoratorNode$,
} from "@mdxeditor/editor";
import {
  HighlightedTextNode,
  LexicalHighlightVisitor,
  MdastHighlightVisitor,
} from "./visitors";

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
      [addImportVisitor$]: [MdastHighlightVisitor],
      [addExportVisitor$]: [LexicalHighlightVisitor],
    });
  },
  update(realm, options): void {
    //Nothing to do here yet?
    realm.pub(stringsToHighlight$, options?.stringsToHighlight ?? []);
    realm.pub(highlightColor$, options?.highlightColor ?? "red");

    const stringsToHighlight = realm.getValue(stringsToHighlight$);

    const md = realm.pipe(
      markdown$,
      map((str: string) => {
        const regex = new RegExp(stringsToHighlight.join("|"), "gi");
        if (regex.test(str)) {
          return str.replace(regex, (match) => `**${match}**`); // replace with your desired replacement
        }
        return str;
      })
    );

    realm.sub(md, (markdown) => {
      const rootEditor = realm.getValue(rootEditor$);
      const currentEditor = realm.getValue(activeEditor$);
      const stringsToHighlight = realm.getValue(stringsToHighlight$);
      if (!stringsToHighlight || stringsToHighlight.length === 0) {
        return;
      }

      if (!rootEditor || !currentEditor) {
        return;
      }

      console.log("Current Editor", currentEditor);

      // This might be useful but we might have to switch back to the TextNode's
      // https://lexical.dev/docs/concepts/transforms
      currentEditor.registerNodeTransform(HighlightedTextNode, (node) => {});

      const hTextNodes = rootEditor.hasNode(HighlightedTextNode);

      console.log(hTextNodes, "HTextNodes");

      // realm.pubIn({ [setMarkdown$]: markdown });
    });
  },
});
