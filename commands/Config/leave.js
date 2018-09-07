const { Command } = require("klasa");

class Leave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manages leave/goodbye messages for this server.",
      permissionLevel: 6,
      aliases: ["goodbye", "leavemessage", "leavemsg"],
      usage: "<disable|enable> [args:string] [...]",
      runIn: ["text"]
    });
  }
  
  async run(msg, [action]) {
    if(action === "disable") {
      return this.disable(msg, true);
    }
    let channel;
    if(msg.mentions.channels.size) {
      channel = msg.mentions.channels.first();
    } else {
      const m = await msg.prompt("Please mention the channel to enable leave messages in.");
      if(!m.mentions.channels.size) throw "Invalid channel mention, try again.";
      channel = m.mentions.channels.first();
    }
    const message = await msg.prompt("Enter the leave message to set, you can use some variables that will be replaced during send time, available variables ```\n{name} - User's name without mention\n{guild} or {server} - The server's name.\n{count} - Current member count``` example: `{name} left {server}, bye, we now have {count} members`", 60000);
    return this.enable(msg, channel, message.content, true, true);
  }
  
  async enable(msg, channel, message, reply = false, force = false) {
    if(msg.guild.settings.leave.enabled && !force) throw "Leave is already enabled!";
    await msg.guild.settings.update([
      ["leave.message", message],
      ["leave.enabled", true],
      ["leave.channel", channel.id]
    ], msg.guild);
    if(reply) return msg.send(`Enabled leave messages in ${channel}`);
  }
  
  async disable(msg, reply = false, force = false) {
    if(!msg.guild.settings.leave.enabled && !force) throw "Leave is already disabled!";
    await msg.guild.settings.update([
      ["leave.message", null],
      ["leave.enabled", false],
      ["leave.channel", null]
    ], msg.guild);
    if(reply) return msg.send("Disabled leave messages.");
  }
}

module.exports = Leave;
