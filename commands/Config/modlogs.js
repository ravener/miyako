const { Command } = require("klasa");

class Modlogs extends Command {
  constructor(...args) {
    super(...args, {
      description: "Configures modlog settings.",
      extendedHelp: "Enables/disables/configures modlog settings, tell it what to log and what to not, i.e modlogs enable messages, will enable logging deleted/edited messages.",
      aliases: ["logs", "modlog"],
      runIn: ["text"],
      permissionLevel: 6,
      usage: "<enable|disable|channel> [args:string]",
      usageDelim: " ",
      subcommands: true
    });
    this.actions = ["ban", "kick", "mute", "leave", "join", "messages", "channels", "roles", "invites", "warn"];
  }
  
  async enableModlogs(msg, channel, reply = false, force = false) {
    if(msg.guild.settings.modlogs.enabled && !force) throw "Modlogs is already enabled.";
    await msg.guild.settings.update([
      ["modlogs.enabled", true],
      ["modlogs.channel", channel.id]
    ], msg.guild);
    if(reply) return msg.send(`Enabled modlogs in channel ${channel}, Note at beginning nothing will be logged, you have to enable which actions to log, to do that run \`${msg.guild.settings.prefix}modlogs enable <key>\` where key is one of \`${this.actions.join(", ")}\`, in addition you may use \`all\` to enable all actions, there is also a \`${msg.guild.settings.prefix}modlogs disable [key]\` to disable an action, if no action provided it disables modlogs, the same actions plus all is also available for disable, to change modlogs channel run \`${msg.guild.settings.prefix}modlogs channel #some-modlogs\`, lastly run \`${msg.guild.settings.prefix}conf show modlogs\` to see all actions that is enabled/disabled, you may change an action using conf command aswell but modlogs command is the recommended way.`);
    return true;
  }
  
  async disableModlogs(msg, reply = false, force = false) {
    if(!msg.guild.settings.modlogs.enabled && !force) throw "Modlogs is already disabled.";
    await msg.guild.settings.update("modlogs.enabled", false, msg.guild, { force: true });
    if(reply) return msg.send(`Disabled modlogs, enable it again anytime with \`${msg.guild.settings.prefix}modlogs enable\``);
    return true;
  }
  
  async enableKey(msg, key, reply = false, force = false) {
    if(msg.guild.settings.get(`modlogs.${key}`) && !force) throw `The key \`modlogs.${key}\` logging is already enabled.`;
    await msg.guild.settings.update(`modlogs.${key}`, true);
    if(reply) return msg.send(`Enabled \`modlogs.${key}\` logging.`);
    return true;
  }
  
  async disableKey(msg, key, reply = false, force = false) {
    if(!msg.guild.settings.get(`modlogs.${key}`) && !force) throw `The key \`modlogs.${key}\` logging is already disabled.`;
    await msg.guild.settings.update(`modlogs.${key}`, false);
    if(reply) return msg.send(`Disabled \`modlogs.${key}\` logging.`);
    return true;
  }
  
  async enable(msg, [...args]) {
    if(!args.length || msg.mentions.channels.size) { // enable modlogs.
      if(!msg.mentions.channels.size) {
        const message = await msg.prompt("Please mention the channel to set modlogs in");
        if(!message.mentions.channels.size) throw "Invalid channel mention, please try again.";
        return this.enableModlogs(msg, message.mentions.channels.first(), true);
      } else {
        return this.enableModlogs(msg, msg.mentions.channels.first(), true);
      }
    }
    // enable key
    const key = args[0];
    if(key.toLowerCase() === "all") {
      const toEnable = this.actions.filter((x) => !msg.guild.settings.get(`modlogs.${x}`));
      if(!toEnable.length) return msg.send("All actions enabled already.");
      await msg.guild.settings.update(toEnable.map((x) => [`modlogs.${x}`, true]));
      return msg.send("Enabled logging all actions.");
    }
    if(!this.actions.includes(key)) throw `Invalid option, modlog options can be one of \`${this.actions.join(", ")}, all\``;
    return this.enableKey(msg, key, true);
  }
  
  async disable(msg, [...args]) {
    if(!args.length) { // disable modlogs.
      return this.disableModlogs(msg, true);
    }
    // disable a key
    const key = args[0];
    if(key.toLowerCase() === "all") {
      const toDisable = this.actions.filter((x) => msg.guild.settings.get(`modlogs.${x}`));
      if(!toDisable.length) return msg.send("All actions disabled already.");
      await msg.guild.settings.update(toDisable.map((x) => [`modlogs.${x}`, false]));
      return msg.send("Disabled logging all actions.");
    }
    if(!this.actions.includes(key)) throw `Invalid option, modlog options can be one of \`${this.actions.join(", ")}, all\``;
    return this.disableKey(msg, key, true);
  }
  
  async channel(msg) {
    if(msg.mentions.channels.size) {
      await this.enableModlogs(msg, msg.mentions.channels.first(), false, true);
      return msg.send(`Changed modlogs channel to ${msg.mentions.channels.first()}`);
    }
    const message = await msg.prompt("Mention the channel to set modlogs to");
    if(!message.mentions.channels.size) throw "Invalid channel mention, please try again.";
    await this.enableModlogs(msg, message.mentions.channels.first(), false, true);
    return msg.send(`Changed modlogs channel to ${message.mentions.channels.first()}`);
  }
}

module.exports = Modlogs;
