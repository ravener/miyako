const { Command } = require("klasa");

class Starboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manages starboard configuration for this server",
      runIn: ["text"],
      aliases: ["star"],
      usage: "<enable|disable|limit> [args:string]",
      subcommands: true,
      usageDelim: " ",
      permissionLevel: 6
    });
  }

  async enable(msg) {
    if(msg.guild.settings.starboard.enabled) throw "Starboard is already enabled!";
    let channel;
    if(msg.mentions.channels.size) {
      channel = msg.mentions.channels.first();
    } else {
      const m = await msg.prompt("Mention the channel to enabled starboard in, type `cancel` to cancel this await");
      if(m.content.toLowerCase() === "cancel") return msg.send("Cancelled.");
      if(!m.mentions.channels.size) throw "Invalid channel mention, please try again";
      channel = m.mentions.channels.first();
    }
    await msg.guild.settings.update([
      ["starboard.enabled", true],
      ["starboard.channel", channel.id]
    ], msg.guild);
    return msg.send(`Enabled starboard in ${channel.toString()}`);
  }

  async disable(msg) {
    if(!msg.guild.settings.starboard.enabled) throw "Starboard is already disabled.";
    await msg.guild.settings.update("starboard.enabled", false);
    return msg.send("Disabled starboard");
  }

  async limit(msg, [limit]) {
    if(!limit) throw "Mention a limit to set";
    if(isNaN(parseInt(limit))) throw "Limit must be a number";
    await msg.guild.settings.update("starboard.limit", parseInt(limit));
    return msg.send(`Set starboard star limit to ${parseInt(limit)}`);
  }
}

module.exports = Starboard;
