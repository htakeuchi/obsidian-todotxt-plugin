import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
} from 'obsidian';
import { CSVView, VIEW_TYPE_CSV } from './view';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    // This creates an icon in the left ribbon
    // Could be used to jump to the default todo list
    // const ribbonIconEl = this.addRibbonIcon(
    //   'dice',
    //   'Todo Plugin',
    //   (evt: MouseEvent) => {
    //     // Called when the user clicks the icon.
    //     new Notice('This is a notice!');
    //   },
    // );
    // // Perform additional things with the ribbon
    // ribbonIconEl.addClass('my-plugin-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    // TODO: add a count of todos
    // const statusBarItemEl = this.addStatusBarItem();
    // statusBarItemEl.setText('Todotxt');

    this.registerView(
      VIEW_TYPE_CSV,
      (leaf: WorkspaceLeaf) => new CSVView(leaf),
    );
    this.registerExtensions(['todotxt'], VIEW_TYPE_CSV);

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new TodoSettingTab(this.app, this));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    // this.registerDomEvent(document, "click", (evt: MouseEvent) => {
    //   console.log("click", evt);
    // });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    // this.registerInterval(
    //   window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    // );
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

// class TodoModal extends Modal {
//   constructor(app: App) {
//     super(app);
//   }
//
//   onOpen() {
//     const { contentEl } = this;
//     contentEl.setText("Woah!");
//   }
//
//   onClose() {
//     const { contentEl } = this;
//     contentEl.empty();
//   }
// }

class TodoSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for TodoTxt plugin.' });

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder('Enter your secret')
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            console.log('Secret: ' + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
