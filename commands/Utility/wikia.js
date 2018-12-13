const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const Wikia = require("wikia");

class WikiaCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search a wiki from wikia.com",
      usage: "<term:string>",
      requiredPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY", "EMBED_LINKS"]
    });
    this.wikia = new Wikia();
  }

  async run(msg, [term]) {
    const res = await this.wikia.searchWikis(term, { expand: true })
      .catch(() => null);
    if(!res || !res.items || !res.items.length) throw "No results found.";
    const display = new RichDisplay(new MessageEmbed().setColor(0xFF0000));
    for(const wiki of res.items) display.addPage((em) => em
      .setTitle(wiki.name)
      .setURL(wiki.url)
      .setDescription(`**${wiki.headline || ""}**\n\n${wiki.desc}\n\n${wiki.url}`)
      .setImage(wiki.image));
    return display.run(await msg.send("Loading..."), {
      filter: (reaction, user) => user.id === msg.author.id,
      time: 30 * 1000
    });
  }
}

module.exports = WikiaCommand;
