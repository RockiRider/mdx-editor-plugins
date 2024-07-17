import {
  Cell,
  addActivePlugin$,
  realmPlugin,
  markdown$,
  Signal,
  map,
  activeEditor$,
} from "@mdxeditor/editor";
import { TextNode } from "lexical";
import { checkIfArrayIncludes, checkIfSubstringIncludes } from "./utils";

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

type HighlightPluginOptions = {
  stringsToHighlight: string[];
  highlightColor: string;
};

export const highlightPlugin = realmPlugin<HighlightPluginOptions>({
  init(realm): void {
    realm.pubIn({
      [addActivePlugin$]: "text-highlight",
    });
  },
  postInit(realm, params) {
    const currentEditor = realm.getValue(activeEditor$);
    if (!currentEditor) {
      return;
    }

    // Register listener for textNodes
    currentEditor.registerNodeTransform(TextNode, (textNode) => {
      // This transform runs twice but does nothing the first time because it doesn't meet the preconditions
      const stringsToHighlight = realm.getValue(stringsToHighlight$);

      const currentText = textNode.getTextContent();
      const includes = checkIfArrayIncludes(currentText, stringsToHighlight);
      if (!includes) {
        if (
          textNode
            .getStyle()
            .includes(`color: ${realm.getValue(highlightColor$)}`)
        ) {
          // If the TextNode doesn't include any of the strings to highlight but it is middle, remove the highlight.
          textNode.setStyle(`color: unset`);
        }
        return;
      }

      if (includes) {
        const isAlreadyHighlighted = textNode
          .getStyle()
          .includes(`color: ${realm.getValue(highlightColor$)}`);

        for (let i = 0; i < stringsToHighlight.length; i++) {
          const highlightString = stringsToHighlight[i];
          // Check if the current highlightString is included in the textNode's text

          if (currentText === highlightString && isAlreadyHighlighted) {
            // If the textNode's text is the same as the highlightString and it is already middle, return early to prevent infinite looping
            return;
          }

          if (!checkIfSubstringIncludes(currentText, highlightString)) {
            continue; // Skip to the next highlightString if the current one is not found
          }

          const regex = new RegExp(highlightString, "gi");
          let match;

          while ((match = regex.exec(textNode.getTextContent())) !== null) {
            const start = match.index;
            const end = start + highlightString.length;
            const [before, middle, after] = textNode.splitText(start, end);

            if (!before && !middle && !after) {
              // No nodes exist, we should exit.
              break;
            }

            if (before && !middle && !after) {
              // If there is no middle or after node, this means this is the first node.
              before.setStyle(`color: ${realm.getValue(highlightColor$)}`);
              textNode = before;
              break;
            } else if (before && middle && !after) {
              // This means the middle node is typically the correct target.
              const middleText = middle.getTextContent();
              if (middleText === highlightString) {
                //Check to see if middleText matches the regex, if it does we highlight!
                middle.setStyle(`color: ${realm.getValue(highlightColor$)}`);
              } else {
                //If it doesn't match the regex, we don't highlight.
                middle.setStyle(`color: unset`);
              }
              textNode = middle;
              break;
            } else {
              // This means all 3 exist. Middle should still be the target due to the split
              const middleText = middle.getTextContent();
              if (middleText === highlightString) {
                //Check to see if middleText matches the regex, if it does we highlight!
                middle.setStyle(`color: ${realm.getValue(highlightColor$)}`);
              } else {
                //If it doesn't match the regex, we don't highlight.
                middle.setStyle(`color: unset`);
              }
              textNode = after;
              break;
            }
          }
        }
      }
    });
  },
  update(realm, options): void {
    realm.pub(stringsToHighlight$, options?.stringsToHighlight ?? []);
    realm.pub(highlightColor$, options?.highlightColor ?? "red");
  },
});
