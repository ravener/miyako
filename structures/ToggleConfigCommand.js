const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

// An extended command making it easier to do enable/disable config commands
// lb.<config command> [enable|disable]
// => Disabled <x> setting
// etc
// Made this due to me keep repeating myself in this kind of commmands
// this should make it less repeating and keep them consistent.
class ToggleConfigCommand extends Command {
  constructor(client, store, file, directory, { key, friendlyName, ...options } = {}) {
    options.usage = "(action:resolver)";
    options.runIn = ["text"];
    if(!options.description) options.description = `Enable or disable ${friendlyName || key} for this server.`;
    if(!options.permissionLevel) options.permissionLevel = 6;
    super(client, store, file, directory, options);
    this.key = key;
    this.friendlyName = friendlyName;

    this.createCustomResolver("resolver", (arg, possible, msg) => {
      if(!arg) return undefined;
      if(!["disable", "enable"].includes(arg.toLowerCase())) throw msg.language.get("COMMANDMESSAGE_NOMATCH", "enable, disable");
      return arg.toLowerCase();
    });
  }

  get displayKey() {
    return this.friendlyName || this.key;
  }

  run(msg, [action]) {
    if(!action) return this.view(msg);
    return this[action](msg);
  }

  view(msg) {
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`**${this.displayKey}** is currently **${this.format(msg)}**.`)
      .setFooter(`To ${this.formatAction(msg)} ${this.displayKey} use ${msg.guild.settings.prefix}${this.name} ${this.formatAction(msg)}`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    return msg.send({ embed });
  }

  async enable(msg) {
    if(msg.guild.settings.get(this.key)) throw `**${this.displayKey}** is already enabled.`;
    await msg.guild.settings.update(this.key, true);
    return msg.send(`Successfully enabled **${this.displayKey}**.`);
  }

  async disable(msg) {
    if(!msg.guild.settings.get(this.key)) throw `**${this.displayKey}** is already disabled.`;
    await msg.guild.settings.update(this.key, false);
    return msg.send(`Successfully disabled **${this.displayKey}**.`);
  }

  formatAction(msg) {
    return this.format(msg) === "Enabled" ? "disable" : "enable";
  }

  format(msg) {
    return msg.guild.settings.get(this.key) === true ? "Enabled" : "Disabled";
  }
}

module.exports = ToggleConfigCommand;
