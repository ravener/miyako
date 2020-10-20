const Command = require("../../structures/Command.js");


class UserPrefix extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manage Per-User Global prefixes.",
      aliases: ["uprefix"],
      usage: "userprefix <add|remove|list:default> <prefix>",
      extendedHelp: "With this command you can add a prefix that only you can use everywhere this bot is available. Convenient for those who find the prefix uncomfortable or just wants to stick with one prefix everywhere. Keep in mind prefixes are case insensitives so do not worry about that."
    });
  }

  async run(msg, [action = "list", ...args]) {
    if(!["add", "remove", "list"].includes(action))
      return msg.send(`Usage: \`${msg.guild.prefix}${this.usage}\``);

    return this[action](msg, args);
  }

  async add(msg, args) {
    if(msg.author.settings.prefix && msg.author.settings.prefix.length >= 10)
      return msg.send("Baka! You can't have more than 10 prefixes. Remove some before trying again.");
    
    const prefixInput = args.join(" ").toLowerCase();
    if(!prefixInput) return msg.send("Baka! You must provide a prefix.");

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if(prefixInput.length > 15) return msg.send("Baka! Prefix cannot be longer than 15 characters!");

    // Get existing prefixes to append to.
    const prefix = msg.author.settings.prefix || [];

    // Avoid duplicates.
    if(prefix.includes(prefixInput)) return msg.send("Baka! That prefix is already on the list.");

    prefix.push(prefixInput);

    await msg.author.update({ prefix });
    return msg.send(`Successfully added the prefix \`${prefixInput}\` to your list of prefixes.`);
  }

  async list(msg) {
    if(!msg.author.settings.prefix || !msg.author.settings.prefix.length)
      return msg.send("You don't have any user prefixes yet!");

    const embed = this.client.embed()
      .setTitle("User Prefixes")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setDescription(msg.author.settings.prefix.map((prefix) => `• ${prefix}`).join("\n"));

    return msg.send({ embed });
  }

  async remove(msg, args) {
    if(!msg.author.settings.prefix || !msg.author.settings.prefix)
      return msg.send("You don't have any prefixes to remove!");

    const prefixInput = args.join(" ").toLowerCase();
    if(!prefixInput) return msg.send("Baka! You must provide a prefix to remove!");

    const prefix = msg.author.settings.prefix;
    if(!prefix.includes(prefixInput)) return msg.send("Baka! That prefix is not in your list.");

    prefix.splice(prefix.indexOf(prefixInput), 1);

    await msg.author.update({ prefix });

    return msg.send(`Successfully removed the prefix \`${prefixInput}\` from your prefix list.`);
  }
}

module.exports = UserPrefix;
