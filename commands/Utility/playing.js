const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Playing extends Command {
  constructor(...args) {
    super(...args, {
      description: "Shows list of people playing a game you say",
      usage: "<game:string>",
      runIn: ["text"],
      aliases: ["whoisplaying"]
    });
  }

  async run(msg, [game]) {
    const members = msg.guild.members.filter((member) => member.presence.activity && member.presence.activity.name && member.presence.activity.name.toLowerCase() === game.toLowerCase()).array();
    if(!members.length) throw "No one found playing that game";
    const embed = new MessageEmbed()
      .setTitle(`Members playing '${game}'`)
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    if(members.length <= 10) { // If 10 or less send in a single embed
      embed.setDescription(members.map((x) => `• **${x.user.tag}** Playing **${x.presence.activity.name}**`).join("\n"));
      return msg.send({ embed });
    }
    const display = new RichDisplay(embed);
    for(let x = 0, t = members.length; x < t; x += 10) {
      const curr = members.slice(x, x + 10);
      display.addPage((em) => em.setDescription(curr.map((x) => `• **${x.user.tag}** Playing **${x.presence.activity.name}**`)));
    }

    return display.run(await msg.send("Loading..."), {
      filter: (reaction, user) => user.id === msg.author.id
    });
  }
}

module.exports = Playing;
