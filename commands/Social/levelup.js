const { Command } = require("klasa");

class Levelup extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manage levelup messages for your server",
      permissionLevel: 6,
      usage: "<enable|disable>",
      aliases: ["levelups", "lvlup", "lvlups"],
      subcommands: true
    });
  }

  async enable(msg) {
    if(msg.guild.settings.levelup) throw "Levelups already enabled.";
    await msg.guild.settings.update("levelup", true);
    return msg.send("Enable levelup messages!");
  }

  async disable(msg) {
    if(!msg.guild.settings.levelup) throw "Levelups are disabled already!";
    await msg.guild.settings.update("levelup", false);
    return msg.send("Turned off levelup messages.");
  }
}

module.exports = Levelup;
