const Command = require("../../structures/Command.js");

class Leave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Leaves a server.",
      ownerOnly: true
    });
  }

  async run(msg, [guild]) {
    if(!guild) return msg.send("Baka! What guild should I leave?");
    if(guild === "this" && msg.guild) guild = msg.guild.id;

    guild = this.client.guilds.cache.get(guild);
    if(!guild) return msg.send("Baka! I'm not in that server.");
    
    await msg.send(`Are you sure you want me to leave **${guild.name}** (${guild.id})`);
    const filter = (msg) => msg.author.id === msg.author.id;
    const attempts = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 });

    if(!attempts || !attempts.size) {
      return msg.send("Ba-Baka! You took too long to answer.");
    }

    const answer = attempts.first().content.toLowerCase();

    if(["yes", "y"].includes(answer)) {
      await guild.leave();
      if(guild.id === msg.guild.id) return msg.author.send(`Successfully left **${guild.name}** (${guild.id})`);
      return msg.send(`Successfully left **${guild.name}** (${guild.id})`);
    }

    if(["no", "n"].includes(answer))
      return msg.send("Cancelled.");

    return msg.send("Invalid response. Cancelled.");
  }
}

module.exports = Leave;
