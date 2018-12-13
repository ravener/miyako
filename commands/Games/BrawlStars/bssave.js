const { Command } = require("klasa");

class BSSave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Save your brawlstars tag.",
      usage: "<tag:sctag>"
    });
  }

  async run(msg, [tag]) {
    await msg.author.settings.update("bstag", tag);
    return msg.send(`Done, saved your tag: \`${tag}\``);
  }
}

module.exports = BSSave;
