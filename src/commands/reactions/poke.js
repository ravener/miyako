const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Poke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Poke someone",
      usage: "poke <@member>",
      guildOnly: true,
      cooldown: 3,
      cost: 5
    });
  }

  async run(msg, [member]) {
    member = await this.verifyMember(msg, member);

    if(member.id === msg.author.id) return msg.send("Baka! You can't poke yourself!");

    const { url } = await fetch("https://nekos.life/api/v2/img/poke")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Poke")
      .setDescription(`**${member.displayName}**, you just got poked by **${msg.member.displayName}**`)
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = Poke;
