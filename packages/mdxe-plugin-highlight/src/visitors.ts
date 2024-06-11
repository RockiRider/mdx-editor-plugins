import { MdastImportVisitor, LexicalExportVisitor } from "@mdxeditor/editor";
import { TextNode, LexicalNode, $applyNodeReplacement } from "lexical";
import * as Mdast from "mdast";

export class HighlightedTextNode extends TextNode {
  static getType(): string {
    return "highlighted-text";
  }

  static clone(node: HighlightedTextNode): HighlightedTextNode {
    // Clone the node here. You might need to adjust this based on your requirements.
    const clonedNode = new HighlightedTextNode(node.__text, node.__key);
    clonedNode.__format = node.__format;
    clonedNode.__style = node.__style;
    clonedNode.__mode = node.__mode;
    clonedNode.__detail = node.__detail;
    return clonedNode;
  }
}

export function $createHighlightedTextNode(text = ""): HighlightedTextNode {
  return $applyNodeReplacement(new HighlightedTextNode(text));
}

/**
 * This runs on markdown import and converts the text nodes to mdast nodes
 */
export const MdastHighlightVisitor: MdastImportVisitor<Mdast.Text> = {
  testNode: "highlighted-text",
  visitNode: function ({ mdastNode, lexicalParent, actions }): void {
    actions.addAndStepInto($createHighlightedTextNode());
  },
  priority: 1,
};

export function $isHighlightedTextNode(
  node: LexicalNode
): node is HighlightedTextNode {
  return node instanceof HighlightedTextNode;
}

/**
 * This runs on lexical export
 */
export const LexicalHighlightVisitor: LexicalExportVisitor<
  HighlightedTextNode,
  Mdast.Text
> = {
  testLexicalNode: $isHighlightedTextNode,
  visitLexicalNode: ({ actions }) => {
    actions.addAndStepInto("paragraph");
  },
  priority: 1,
};
