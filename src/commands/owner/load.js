const Command = require("../../structures/Command.js");
const Store = require("../../structures/Store.js");

class Load extends Command {
  constructor(...args) {
    super(...args, {
      description: "Loads all commands/events",
      ownerOnly: true
    });
  }

  async run(msg, [store]) {
    if(!store) return msg.send("What store am i supposed to reload?");
    store = this.client[store];
    if(!(store instanceof Store)) return msg.send("Baka! That's not an actual store.");

    try {
      const before = store.size;
      await store.loadFiles();
      const after = store.size - before;
      return msg.send(`Successfully reloaded/loaded ${store.size} ${store.name}. ${after === 0 ? "There was nothing new right?" : `${after} new ${store.name} were loaded.`}`);
    } catch(err) {
      return msg.send(`There was an error loading all files: \`${err.message}\``);
    }
  }
}

module.exports = Load;
