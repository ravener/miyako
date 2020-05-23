const Command = require("../../structures/Command.js");

class Leave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Leaves a server.",
      ownerOnly: true
    });
  }

  async run(ctx, [guild]) {
    if(!guild) return ctx.reply("Baka! What guild should I leave?");
    if(guild === "this" && ctx.guild) guild = ctx.guild.id;

    guild = this.client.guilds.cache.get(guild);
    if(!guild) return ctx.reply("Baka! I'm not in that server.");
    
    await ctx.reply(`Are you sure you want me to leave **${guild.name}** (${guild.id})`);
    const filter = (msg) => msg.author.id === ctx.author.id;
    const attempts = await ctx.channel.awaitMessages(filter, { time: 15000, max: 1 });

    if(!attempts || !attempts.size) {
      return ctx.reply(`Ba-Baka! You took too long to answer.`);
    }

    const answer = attempts.first().content.toLowerCase();

    if(["yes", "y"].includes(answer)) {
      await guild.leave();
      if(guild.id === ctx.guild.id) return ctx.author.send(`Successfully left **${guild.name}** (${guild.id})`);
      return ctx.reply(`Successfully left **${guild.name}** (${guild.id})`);
    }

    if(["no", "n"].includes(answer))
      return ctx.reply("Cancelled.");

    return ctx.reply("Invalid response. Cancelled.");
  }
}

module.exports = Leave;
