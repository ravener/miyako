const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Queue extends Command {
  constructor(...args) {
    super(...args, {
      description: "Views the music queue!",
      runIn: ["text"]
    });
  }

  async run(msg) {
    const player = this.client.lavalink.get(msg.guild.id);
    if(!player || !player.queue.length) throw "There isn't anything in the queue";
    const embed = new MessageEmbed()
      .setTitle("Music Queue")
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    if(player.queue.length <= 10) {
      embed.setDescription(player.queue.map((x) => `• **${x.song.title}** requested by **${x.requester.displayName}**`));
      return msg.send({ embed });
    }
    const display = new RichDisplay(embed);
    for (let x = 0, t = player.queue.length; x < t; x += 10) {
      const curr = player.queue.slice(x, x + 10);
      display.addPage((em) => em.setDescription(curr.map((x) => `• **${x.song.title}** requested by **${x.requester.displayName}**`)));
    }
    return display.run(await msg.send("Loading queue..."), {
      filter: (reaction, user) => user.id === msg.author.id
    });
  }
}

module.exports = Queue;
