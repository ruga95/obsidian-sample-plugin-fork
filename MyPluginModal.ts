import {
	App,
	FuzzySuggestModal,
	Modal,
	Notice,
	Setting,
	SuggestModal,
} from "obsidian";

interface Book {
	title: string;
	author: string;
}

const ALL_BOOKS = [
	{
		title: "How to Take Smart Notes",
		author: "Sönke Ahrens",
	},
	{
		title: "Thinking, Fast and Slow",
		author: "Daniel Kahneman",
	},
	{
		title: "Deep Work",
		author: "Cal Newport",
	},
];

export class MyPluginFuzzyModal extends FuzzySuggestModal<Book> {
	getItems(): Book[] {
		return ALL_BOOKS;
	}

	getItemText(book: Book): string {
		return book.title;
	}

	onChooseItem(book: Book, evt: MouseEvent | KeyboardEvent) {
		new Notice(`Selected ‘${book.title}’`);
	}
}

export class MyPluginSuggestModal extends SuggestModal<Book> {
	// Returns all available suggestions.
	getSuggestions(query: string): Book[] {
		return ALL_BOOKS.filter((book) =>
			book.title.toLowerCase().includes(query.toLowerCase())
		);
	}

	// Renders each suggestion item.
	renderSuggestion(book: Book, el: HTMLElement) {
		el.createEl("div", { text: book.title });
		el.createEl("small", { text: book.author });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(book: Book, evt: MouseEvent | KeyboardEvent) {
		new Notice(`Selected ‘${book.title}’`);
	}
}

export class MyPluginSubmitModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "What's your name?" });

		new Setting(contentEl).setName("Name").addText((text) =>
			text.onChange((value) => {
				this.result = value;
			})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class MyPluginModal extends Modal {
	msg: string | DocumentFragment;

	constructor(app: App, msg: string | DocumentFragment) {
		super(app);
		this.msg = msg;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText(this.msg);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
