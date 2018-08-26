const { Command, RichDisplay, util } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: (language) => language.get("COMMAND_HELP_DESCRIPTION"),
      usage: "(command:command)",
      guarded: true,
      requiredPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"]
    });
    
    this.createCustomResolver("command", (arg, possible, message) => {
      if (!arg || arg === "") return undefined;
      return this.client.arguments.get("command").run(arg, possible, message);
    });
  }
  
  async run(msg, [command]) {
    if(command) {
      const cost = command.category === "Canvas" ? "$10" : command.cost ? `$${command.cost}` : "None";
      const embed = new MessageEmbed()
        .setTitle(command.name)
        .setColor(0xff0000)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setDescription([
          `**${util.isFunction(command.description) ? command.description(msg.language) : command.description}**`,
          `**Cost**: ${cost}`,
          msg.language.get("COMMAND_HELP_USAGE", command.usage.fullUsage(msg)),
          msg.language.get("COMMAND_HELP_EXTENDED"),
          `\`\`\`${util.isFunction(command.extendedHelp) ? command.extendedHelp(msg.language) : command.extendedHelp}\`\`\``
        ].join("\n"));
      return msg.send({ embed });
    }
    const display = new RichDisplay(
      new MessageEmbed()
        .setColor(0xff0000)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
    );
    const help = await this.buildHelp(msg);
    const categories = Object.keys(help);
    for(let cat = 0; cat < categories.length; cat++) {
      const message = ["`"];
      display.addPage((em) => {
        em.setTitle(`${categories[cat]} Commands`);
        const subCategories = Object.keys(help[categories[cat]]);
        for (let subCat = 0; subCat < subCategories.length; subCat++) message.push(`${help[categories[cat]][subCategories[subCat]].join("\n")}`);
        message.push("`");
        em.setDescription(message.join("\n"));
        return em;
      });
    }
    return display.run(await msg.send("Loading commands..."), { filter: (reaction, user) => user.id === msg.author.id });
  }
  
  async buildHelp(message) {
    const help = {};

    const commandNames = [...this.client.commands.keys()];
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    await Promise.all(this.client.commands.map((command) =>
      this.client.inhibitors.run(message, command, true)
        .then(() => {
          if (!help.hasOwnProperty(command.category)) help[command.category] = {};
          if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];
          const description = typeof command.description === "function" ? command.description(message.language) : command.description;
          help[command.category][command.subCategory].push(`${message.guildSettings.prefix}${command.name.padEnd(longest)} ${description}`);
        })
        .catch(() => {
          // noop
        })
    ));

    return help;
  }
}

module.exports = Help;
