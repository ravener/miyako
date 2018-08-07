const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Poll extends Command {
  constructor(...args) {
    super(...args, {
      description: "Creates a poll!",
      extendedHelp: "Seperate your choices with |, the first one is the question, channel is optional and defaults to current channel.",
      usage: "[channel:channel] <choices:string> [...]",
      usageDelim: " ",
      runIn: ["text"],
      cooldown: 5,
      requiredPermissions: ["EMBED_LINKS", "ADD_REACTIONS"]
    });
    
    this.emojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];
  }
  
  async run(msg, [channel = msg.channel, ...choices]) {
    if(!channel.postable) throw "I cannot send message in that channel.";
    if(!channel.permissionsFor(msg.member).has("SEND_MESSAGES")) throw "You can't post in that channel.";
    choices = choices.join(" ").split("|");
    const question = choices.shift();
    if(choices.length < 2) throw "Not enough choices, seperate choices with |, i.e `poll #polls Do you want to play fortnite? | Yes | No`, channel is optional and defaults to current channel.";
    if(choices.length > 10) throw "You can only have upto 10 choices.";
    const emojis = this.emojis.slice(0, choices.length);
    let counter = 1;
    const embed = new MessageEmbed()
      .setTitle(question)
      .setColor(0xff0000)
      .setDescription(choices.map((c) => `${counter++}. ${c}`).join("\n"))
      .setFooter(`Asked by ${msg.author.tag}`, msg.author.displayAvatarURL());
    const poll = await channel.send({ embed });
    for(const emoji of emojis) {
      await poll.react(emoji);
    }
    if(msg.deletable) await msg.delete();
  }
}

module.exports = Poll;