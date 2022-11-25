const Command = require("../../structures/Command.js");

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: "View help for commands.",
      usage: "help [command]",
      options: [
        {
          name: "command",
          description: "Get information about a command.",
          type: "string"
        }
      ]
    });
  }

  async run(ctx, options) {
    const command = options.getString("command");

    if (command) {
      const cmd = this.store.get(command);
      if (!cmd) {
        return ctx.reply("That command does not exist! Why would you think I'd have such a thing?");
      }

      /* let cost = msg.tr("NONE");

      if (cmd.cost && (msg.guild && msg.guild.settings.social)) {
        const premium = await this.client.verifyPremium(msg.author);

        if (premium) {
          // Premium users get a 25% off the cost.
          cost = `¥${cmd.cost - Math.floor(cmd.cost / 2 / 2)}`;
        } else {
          cost = `¥${cmd.cost}`;
        }
      }*/

      if (cmd.nsfw && !ctx.nsfw) {
        return ctx.reply("Baka! You can't view details of that command in a non NSFW channel.");
      }

      const embed = this.client.embed(this.client.user)
        .setTitle(`Help - ${cmd.name}`)
        .setDescription([
          `**Description:** ${cmd.description}`,
          `**Category:** ${cmd.category}`,
          `**Aliases:** ${cmd.aliases.length ? cmd.aliases.join(", ") : "None"}`,
          `**Cooldown:** ${cmd.cooldown ? cmd.cooldown + " seconds" : "None"}`,
          `**Usage:** @Miyako ${cmd.usage}`,
          // `**Cost:** ${cost}`,
          `**Extended Help:** ${cmd.extendedHelp}`
        ].join("\n"));

      return ctx.reply({ embeds: [embed] });
    }

    const map = {}; // Map<Category, Array<Command.Name>>
    for (const command of this.store.values()) {
      // Check for hidden commands first so if all commands in a category is hidden we won't even show the category.
      if (command.hidden) continue;
      if (command.ownerOnly && !ctx.owner) continue;
      if (command.nsfw && !ctx.channel.nsfw) continue;

      // Try translating the category name.
      const category = command.category;

      if (!map[category]) map[category] = [];
      map[category].push(command.name);
    }

    const embed = this.client.embed(this.client.user)
      .setTitle("Help - Commands")
      .setDescription("Join our [Discord Server](https://discord.gg/mDkMbEh) for support and updates!")
      .setFooter({
        text: "For more information about a command run @Miyako help <command>"
      });

    // Sort the categories alphabetically.
    const keys = Object.keys(map).sort();

    for (const category of keys) {
      // Skip un-needed categories
      // if (category === "Social" && msg.guild && !msg.guild.settings.social) continue;
      embed.addFields({
        name: category,
        value: map[category].join(", "),
        inline: true
      });
    }

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Help;
