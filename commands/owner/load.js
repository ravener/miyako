const Command = require("../../structures/Command.js");
const Store = require("../../structures/Store.js");

class Load extends Command {
  constructor(...args) {
    super(...args, {
      description: "Loads all commands/events",
      ownerOnly: true
    });
  }

  async run(ctx, [store]) {
    if(!store) return ctx.reply("What store am i supposed to reload?");
    store = this.client[store];
    if(!(store instanceof Store)) return ctx.reply("Baka! That's not an actual store.");

    try {
      const before = store.size;
      await store.loadFiles();
      const after = store.size - before;
      return ctx.reply(`Successfully reloaded/loaded ${store.size} ${store.name}. ${after === 0 ? "There was nothing new right?" : `${after} new pieces were loaded.`}`);
    } catch(err) {
      return ctx.reply(`There was an error loading all files: \`${err.message}\``);
    }
  }
}

module.exports = Load;
