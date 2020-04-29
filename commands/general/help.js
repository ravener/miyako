const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: "View help for commands.",
      usage: "help [command]"
    });
  }

  async run(ctx, [command]) {
    if(command) {
      const cmd = this.store.get(command);
      if(!cmd) return ctx.reply("That command does not exist! Why would you think I'd have such a thing?");
      return ctx.reply(new MessageEmbed()
        .setTitle(`Help - ${cmd.name}`)
        .setColor(0x9590EE)
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 256, format: "png" }))
        .setDescription([
          `**Description:** ${cmd.description}`,
          `**Category:** ${cmd.category}`,
          `**Aliases:** ${cmd.aliases.join("\n")}`,
          `**Cooldown:** ${cmd.cooldown ? cmd.cooldown + " Seconds" : "None"}`,
          `**Usage:** ${ctx.guildPrefix}${cmd.usage}`,
          `**Extended Help:** ${cmd.extendedHelp}`
        ].join("\n")));
    }

    const map = {}; // Map<Category, Array<Command.Name>>
    for(const command of this.store.values()) {
      if(!map[command.category]) map[command.category] = [];
      if(!command.hidden) map[command.category].push(command.name);
    }

    const embed = new MessageEmbed()
      .setTitle("Help - Commands")
      .setColor(0x9590EE)
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 256 }))
      .setFooter("For more information about a command run m!help <command>");

    const keys = Object.keys(map).sort();

    for(const category of keys) {
      if(category === "Owner" && ctx.author.id !== this.client.constants.ownerID) continue;
      if(category === "Social" && !ctx.guild.settings.social) continue;
      embed.addField(category, map[category].join(", "));
    }

    return ctx.reply(embed);
  }
}

module.exports = Help;
