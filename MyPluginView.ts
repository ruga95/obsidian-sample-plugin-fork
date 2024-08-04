import { promises } from "dns";
import { ItemView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE = "myplugin-view";

export class MyPluginView extends ItemView {

  // webviewEl: HTMLWebViewElement;  
  // ..\Obsidian-Surfing-fork\node_modules\@types\react\global.d.ts
  iframeEl: HTMLIFrameElement;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "MyPlugin View";
  }

  onload(): void {
    // console.log("onload :", this.navigation, this.contentEl.doc);
  }

  async onOpen() {
    // console.log("onOpen :", this.containerEl.doc);
  
    // this.contentEl.win.location.href = "https://svelte.dev/"; // failure
		// this.webviewEl = this.contentEl.doc.createElement('webview'); // 

    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "你好卢舸！" });
    this.iframeEl = container.createEl("iframe");
    this.iframeEl.width = "720";
    this.iframeEl.height = "640";
    this.iframeEl.src = "https://www.baidu.com/";

    // console.log(this.contentEl.doc);
  }

  /* protected onClose(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      
    })
  } */  

  async onClose() {
    // Nothing to clean up.
  }
}