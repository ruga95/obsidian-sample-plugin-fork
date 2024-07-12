import MyPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class MyPluginSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const head = containerEl.createEl("div", { cls: "head1" });

		head.createEl("h1", {
			text: "My Plugin Setting",
			cls: "head1__title",
		});

		head.createEl("small", {
			text: "Author : 卢舸 / Sönke Ahrens",
			cls: "head1__author",
		});

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("MyPlugin first setting item")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.setItem1)
					.onChange(async (value) => {
						this.plugin.settings.setItem1 = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Date format")
			.setDesc("Default date format")
			.addText((text) =>
				text
					.setPlaceholder("MMMM dd, yyyy")
					.setValue(this.plugin.settings.dateFormat)
					.onChange(async (value) => {
						this.plugin.settings.dateFormat = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
