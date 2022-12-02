const Command = require("../../structures/Command.js");
const { version } = require("discord.js");
const { getDuration } = require("../../utils/utils.js");

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      description: "View bot statistics and information.",
      aliases: ["info"],
      modes: ["text"]
    });
  }

  async run(ctx) {
    const { client } = this; // Avoid typing a lot of 'this'

    // TODO
    // const cmd = Object.entries(this.client.user.settings.commands).sort((x, y) => x[1] < y[1] ? 1 : -1);
    // const mostUsed = cmd.length ? `${cmd[0][0]} (${cmd[0][1]} times)` : "None";
    const uptime = getDuration(client.uptime);
    const users = client.guilds.cache
      .filter(guild => guild.available)
      .reduce((sum, guild) => sum + guild.memberCount, 0);
    
    const embed = this.client.embed(this.client.user)
      .setTitle("Miyako - Bot Statistics")
      .setDescription("Hi, I'm Miyako. The all-in-one entertainment bot for your server brought to you by my master Ravener#5796")
      .addFields({
        name: "Bot Statistics",
        value: [
          `**Guilds:** ${client.guilds.cache.size.toLocaleString()}`,
          `**Users:** ${users.toLocaleString()}`,
          `**Channels:** ${client.channels.cache.size.toLocaleString()}`,
          `**Uptime:** ${uptime}`,
          `**Total Memory Usage:** ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
          `**Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
        ].join("\n"),
        inline: true
      })
      .addFields({
        name: "Versions",
        value: [
          `**Node.js Version:** ${process.version}`,
          `**Discord.js Version:** v${version}`
        ].join("\n"),
        inline: true
      })
      .addFields({
        name: "Command Stats",
        value: [
          `**Total Commands:** ${this.store.size}`,
          `**Commands Ran:** ${this.store.ran.toLocaleString()}`,
          // `**Most Used:** ${mostUsed}`
        ].join("\n"),
        inline: true
      })
      .addFields({
        name: "Links",
        value: [
          ":star: [GitHub Repository](https://github.com/ravener/miyako)",
          ":robot: [Upvote me at top.gg](https://top.gg/bot/397796982120382464)",
          `:envelope_with_arrow: [Invite me to your server](${client.invite})`,
          ":video_game: [Join our Discord Server](https://discord.gg/mDkMbEh)"
        ].join("\n"),
        inline: true
      });

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Stats;
