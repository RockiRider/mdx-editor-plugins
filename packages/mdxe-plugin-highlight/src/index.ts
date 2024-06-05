import {
  Cell,
  LexicalExportVisitor,
  MdastImportVisitor,
  addActivePlugin$,
  addExportVisitor$,
  addImportVisitor$,
  realmPlugin,
  markdown$,
} from "@mdxeditor/editor";
import { $isTextNode, TextNode } from "lexical";
import * as Mdast from "mdast";

const stringsToHighlight$ = Cell<ReadonlyArray<string>>([]);
const highlightColor$ = Cell<string>("red");

export const MdastHighlightVisitor: MdastImportVisitor<Mdast.Text> = {
  testNode: "text",
  visitNode({ mdastNode, actions }): void {
    console.log("Finally here");
    // const textNode = $createTextNode(mdastNode.value);
    // if (mdastNode.value.includes("Hello")) {
    //   console.log("Includes!");
    //   textNode.setStyle("color: red");
    //   actions.addAndStepInto(textNode);
    // }
  },
  priority: 1,
};

export const LexicalHighlightVisitor: LexicalExportVisitor<
  TextNode,
  Mdast.Text
> = {
  testLexicalNode: $isTextNode,
  visitLexicalNode: ({ actions }) => {
    actions.addAndStepInto("paragraph");
  },
  priority: 1,
};

type HighlightPluginOptions = {
  stringsToHighlight: string[];
  highlightColor: string;
};

export const highlightPlugin = realmPlugin<HighlightPluginOptions>({
  init(realm, options): void {
    console.log("Init");
    realm.pubIn({
      [addActivePlugin$]: "highlight",
      [addImportVisitor$]: [MdastHighlightVisitor],
      [addExportVisitor$]: [LexicalHighlightVisitor],
    });
  },
  update(realm, options): void {
    //Nothing to do here yet?
    realm.pub(stringsToHighlight$, options?.stringsToHighlight ?? []);
    realm.pub(highlightColor$, options?.highlightColor ?? "red");
    // const something = realm;
    realm.sub(markdown$, (markdown) => {
      console.log(markdown);
    });
  },
});
