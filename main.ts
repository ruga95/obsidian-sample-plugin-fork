import { MyPluginSettingTab } from "MyPluginSettingTab";
import {
	MyPluginFuzzyModal,
	MyPluginSubmitModal,
	MyPluginSuggestModal,
	MyPluginModal,
} from "./MyPluginModal";
import {
	addIcon,
	Editor,
	MarkdownView,
	Menu,
	Notice,
	Plugin,
	setIcon,
	TFile,
	WorkspaceLeaf,
} from "obsidian";

interface MyPluginSettings {
	setItem1: string;
	dateFormat: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	setItem1: "default",
	dateFormat: "YYYY-MM-DD",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	statusBarSpan: HTMLSpanElement;


	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		// save to data.json
		await this.saveData(this.settings);
		console.log("saveSettings :", this.settings);
	}

	async onload() {
		await this.loadSettings();
		// console.log("MyPlugin onload :", this, "你好卢舸！");

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MyPluginSettingTab(this.app, this));

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();

		// adds icon to the status bar
		setIcon(statusBarItemEl, "info");

		this.statusBarSpan = this.addStatusBarItem().createSpan();

		// Add custom icon
		addIcon("circle", `<circle cx="50" cy="50" r="40" fill="yellow" />`);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"circle", // dice-6
			"Show modal",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				this.showModal();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		this.addRibbonIcon(
			"carrot",
			"Show complex modal",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new MyPluginSubmitModal(this.app, (result) => {
					new Notice(`Hello, ${result}!`);
				}).open();
			}
		);

		this.addRibbonIcon("book", "Show suggest modal", (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new MyPluginSuggestModal(this.app).open();
		});

		this.addRibbonIcon(
			"book-text",
			"Show fuzzy modal",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new MyPluginFuzzyModal(this.app).open();
			}
		);

		this.addRibbonIcon("timer-reset", "Show notice", (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice("My plugin added ribbon icon.");
		});

		this.addRibbonIcon("menu", "Open menu", (e: MouseEvent) => {
			const menu = new Menu();

			menu.addItem((item) =>
				item
					.setTitle("Copy")
					.setIcon("documents")
					.onClick(() => {
						new Notice("Copied");
					})
			);

			menu.addItem((item) =>
				item
					.setTitle("Paste")
					.setIcon("paste")
					.onClick(() => {
						new Notice("Pasted");
					})
			);

			/* console.log(
				"MouseEvent \n x, y : %d, %d \n pageX, pageY : %d, %d \n clientX, clientY : %d, %d \n offsetX, offsetY : %d, %d \n screenX, screenY : %d, %d \n movementX, movementY : %d, %d",
				e.x,
				e.y,
				e.pageX,
				e.pageY,
				e.clientX,
				e.clientY,
				e.offsetX,
				e.offsetY,
				e.screenX,
				e.screenY,
				e.movementX,
				e.movementY
			); */
			menu.showAtMouseEvent(e);
			menu.showAtPosition({ x: e.x + 16, y: e.y - 8 });
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Print file path 👈")
						.setIcon("document")
						.onClick(async () => {
							new Notice(file.path);
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item.setTitle("Print file path 👈")
						.setIcon("document")
						.onClick(async () => {
							if (view.file) new Notice(view.file.path);
							else new Notice("view.file is null");
						});
				});
			})
		);

		// this.readActiveFile();

		this.app.workspace.on("active-leaf-change", (leaf: WorkspaceLeaf) => {
			// this.readActiveFile();
			this.readActiveFile2(leaf);
		});

		this.app.workspace.on("editor-change", (editor) => {
			// console.log("workspace.on editor-change editor :", editor);
			// this.updateLineCount(editor.getDoc().getValue());
			this.updateLineCount(editor.getValue());
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "show-modal",
			name: "Show modal",
			callback: this.showModal.bind(this),
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "show-root-leaves-check",
			name: "Show root leaves(check)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						this.app.workspace.iterateRootLeaves((leaf) =>
							console.log("workspace.iterateRootLeaves :", leaf)
						);
					}
					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			},
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "change-selection",
			name: "Change selection",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(
					"command 'Change selection' editor :",
					editor.getSelection(),
					editor.getValue()
				);
				editor.replaceSelection("你好卢舸！");
			},
		});

		let num = 0;
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(
				() => statusBarItemEl.setText(`setInterval : ${++num}`),
				1 * 60 * 1000
			)
		);
	}

	private showModal() {
		// console.log(this, this.app);
		const mdv = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (mdv) {
			new MyPluginModal(this.app, mdv.getViewData()).open();
		} else {
			new MyPluginModal(this.app, "Michael Corleone. 👀").open();
		}
	}

	private updateLineCount(content?: string) {
		const count = content ? content.split(/\r\n|\r|\n/).length : 0;
		const lineword = count === 1 ? "Line" : "Lines";
		this.statusBarSpan.textContent = `${count} ${lineword}`;
	}

	private async readActiveFile() {
		const file: TFile | null = this.app.workspace.getActiveFile();
		// console.log("readActiveFile file :", file);
		if (file) {
			const content = await this.app.vault.read(file);
			this.updateLineCount(content);
		} else {
			this.updateLineCount(undefined);
		}
	}

	private readActiveFile2(leaf: WorkspaceLeaf | null): void {
		const vType = leaf?.view.getViewType();
		const mdv = this.app.workspace.getActiveViewOfType(MarkdownView);
		// console.log("readActiveFile2 \nvType :", vType, "\nmdv :", mdv);
		if (vType === "markdown" && mdv) {
			this.updateLineCount(mdv.getViewData());
		} else if (vType === "empty") {
			this.statusBarSpan.textContent = "";
		}
	}
}
