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

      let cost = "None";

      if(cmd.cost && (ctx.guild && ctx.guild.settings.social)) {
        const premium = await this.client.verifyPremium(ctx.author);

        if(premium) {
          // Premium users get a 25% off the cost.
          cost = `¥${cmd.cost - Math.floor(cmd.cost / 2 / 2)}`;
        } else {
          cost = `¥${cmd.cost}`;
        }
      }

      if(cmd.nsfw && (ctx.guild && !ctx.channel.nsfw))
        return ctx.reply("Baka! You can't view details of that command in a non NSFW channel.");

      return ctx.reply(new MessageEmbed()
        .setTitle(`Help - ${cmd.name}`)
        .setColor(0x9590EE)
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
        .setDescription([
          `**Description:** ${cmd.description}`,
          `**Category:** ${cmd.category}`,
          `**Aliases:** ${cmd.aliases.length ? cmd.aliases.join(", ") : "None"}`,
          `**Cooldown:** ${cmd.cooldown ? cmd.cooldown + " Seconds" : "None"}`,
          `**Usage:** ${ctx.guild ? ctx.guild.settings.prefix : "m!"}${cmd.usage}`,
          `**Cost:** ${cost}`,
          `**Extended Help:** ${cmd.extendedHelp}`
        ].join("\n")));
    }

    const map = {}; // Map<Category, Array<Command.Name>>
    for(const command of this.store.values()) {
      // Check for hidden commands first so if all commands in a category is hidden we won't even show the category.
      if(command.hidden) continue;
      if(command.ownerOnly && ctx.author.id !== this.client.constants.ownerID) continue;
      if(command.nsfw && !ctx.channel.nsfw) continue;

      if(!map[command.category]) map[command.category] = [];
      map[command.category].push(command.name);
    }

    const embed = new MessageEmbed()
      .setTitle("Help - Commands")
      .setColor(0x9590EE)
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
      .setFooter("For more information about a command run m!help <command>");

    // Sort the categories alphabetically.
    const keys = Object.keys(map).sort();

    for(const category of keys) {
      // Skip un-needed categories
      if(category === "Social" && ctx.guild && !ctx.guild.settings.social) continue;
      
      embed.addField(category, map[category].join(", "));
    }

    return ctx.reply({ embed });
  }
}

module.exports = Help;
