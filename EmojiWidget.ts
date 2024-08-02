import { EditorView, WidgetType } from "@codemirror/view";

export class EmojiWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const span = document.createElement("span");
    span.innerText = "🥬";
    return span;
  }
}