const { Command } = require("klasa");

class Welcome extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manages welcome/greeting messages for this server.",
      permissionLevel: 6,
      aliases: ["welc", "welcomemessage", "welcomemsg"],
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
      const m = await msg.prompt("Please mention the channel to enable welcome messages in.");
      if(!m.mentions.channels.size) throw "Invalid channel mention, try again.";
      channel = m.mentions.channels.first();
    }
    const message = await msg.prompt("Enter the welcome message to set, you can use some variables that will be replaced during send time, available variables ```\n{user} or {mention} - mentions the user\n{name} - User's name without mention\n{guild} or {server} - The server's name.\n{count} - Current member count``` example: `Welcome {user} to {server}, we now have {count} members`", 60000);
    return this.enable(msg, channel, message.content, true, true);
  }
  
  async enable(msg, channel, message, reply = false, force = false) {
    if(msg.guild.settings.welcome.enabled && !force) throw "Welcome is already enabled!";
    await msg.guild.settings.update([
      ["welcome.message", message],
      ["welcome.enabled", true],
      ["welcome.channel", channel.id]
    ], msg.guild);
    if(reply) return msg.send(`Enabled welcome messages in ${channel}`);
  }
  
  async disable(msg, reply = false, force = false) {
    if(!msg.guild.settings.welcome.enabled && !force) throw "Welcome is already disabled!";
    await msg.guild.settings.update([
      ["welcome.message", null],
      ["welcome.enabled", false],
      ["welcome.channel", null]
    ], msg.guild);
    if(reply) return msg.send("Disabled welcome messages.");
  }
}

module.exports = Welcome;
