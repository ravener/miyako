const Command = require("../../structures/Command.js");


class Poll extends Command {
  constructor(...args) {
    super(...args, {
      description: "Creates a poll!",
      extendedHelp: "Seperate your choices with |, the first one is the question, channel is optional and defaults to current channel.",
      usage: "poll [#channel] <question | choice1 | choice 2 | choice 3 ...>",
      guildOnly: true,
      cooldown: 5,
      botPermissions: ["EMBED_LINKS", "ADD_REACTIONS"]
    });
    
    this.emojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];
  }
  
  async run(msg, [channeltxt, ...choices]) {
    // Optional argument trick, maybe find a better way sometimes.
    let channel = await this.verifyChannel(msg, channeltxt, true).catch(() => null);
    const args = [...choices];

    if(!channel) {
      args.unshift(channeltxt);
      channel = msg.channel;
    }

    if(!args.length) return msg.send(`Baka! You need to provide me arguments. Usage: \`${msg.guild.settings.prefix}${this.usage}\``);

    // if(!channel.postable) throw "I cannot send message in that channel.";
    if(!channel.permissionsFor(msg.member).has("SEND_MESSAGES")) return msg.send("Baka! You can't post in that channel.");
    choices = args.join(" ").split("|");
    const question = choices.shift();
    if(choices.length < 2) return msg.send("Not enough choices, seperate choices with |, i.e `poll #polls Do you want to play fortnite? | Yes | No`, channel is optional and defaults to current channel.");
    if(choices.length > 10) return msg.send("You can only have up to 10 choices.");
    const emojis = this.emojis.slice(0, choices.length);
    let counter = 1;

    const embed = this.client.embed()
      .setTitle(question)
      .setDescription(choices.map((c) => `${counter++}. ${c}`).join("\n"))
      .setFooter(`Asked by ${msg.author.tag}`, msg.author.displayAvatarURL({ size: 64 }));

    const poll = await channel.send({ embed });

    for(const emoji of emojis) {
      await poll.react(emoji);
    }

    if(msg.deletable) await msg.delete();
  }
}

module.exports = Poll;
