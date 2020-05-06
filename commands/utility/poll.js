const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

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
  
  async run(ctx, [channeltxt, ...choices]) {
    // Optional argument trick, maybe find a better way sometimes.
    const channel = await this.verifyChannel(ctx, channeltxt, true).catch(() => null);
    const args = [...choices];
    if(!channel) args.unshift(channeltxt);

    if(!args.length) return ctx.reply(`Baka! You need to provide me arguments. Usage: \`${ctx.guild.settings.prefix}${this.usage}\``);

    // if(!channel.postable) throw "I cannot send message in that channel.";
    if(!channel.permissionsFor(ctx.member).has("SEND_MESSAGES")) return ctx.reply("Baka! You can't post in that channel.");
    choices = args.join(" ").split("|");
    const question = choices.shift();
    if(choices.length < 2) return ctx.reply("Not enough choices, seperate choices with |, i.e `poll #polls Do you want to play fortnite? | Yes | No`, channel is optional and defaults to current channel.");
    if(choices.length > 10) return ctx.reply("You can only have up to 10 choices.");
    const emojis = this.emojis.slice(0, choices.length);
    let counter = 1;

    const embed = new MessageEmbed()
      .setTitle(question)
      .setColor(0x9590EE)
      .setDescription(choices.map((c) => `${counter++}. ${c}`).join("\n"))
      .setFooter(`Asked by ${ctx.author.tag}`, ctx.author.displayAvatarURL({ size: 64 }));

    const poll = await channel.send({ embed });

    for(const emoji of emojis) {
      await poll.react(emoji);
    }

    if(ctx.message.deletable) await ctx.message.delete();
  }
}

module.exports = Poll;
