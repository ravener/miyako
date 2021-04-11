const Command = require("../../structures/Command.js");
const { version } = require("discord.js");

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      description: "View bot statistics and information.",
      aliases: ["info"]
    });
  }

  async run(msg) {
    const { client } = this; // Avoid typing a lot of 'this'

    const cmd = Object.entries(this.client.user.settings.commands).sort((x, y) => x[1] < y[1] ? 1 : -1);
    const mostUsed = cmd.length ? `${cmd[0][0]} (${cmd[0][1]} times)` : "None";
    const uptime = this.client.utils.getDuration(client.uptime);

    return msg.send(this.client.embed(this.client.user)
      .setTitle(msg.language.get("COMMAND_STATS_TITLE"))
      .setDescription(msg.language.get("COMMAND_STATS_DESCRIPTION"))
      .addField(msg.language.get("COMMAND_STATS_FIELD"), [
        `**Guilds:** ${client.guilds.cache.size}`,
        `**Users:** ${client.guilds.cache.reduce((sum, guild) => sum + (guild.available ? guild.memberCount : 0), 0)}`,
        `**Channels:** ${client.channels.cache.size}`,
        `**Uptime:** ${uptime}`,
        `**Total Memory Usage:** ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        `**Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      ].join("\n"))
      .addField("Versions", [
        `**Node.js Version:** ${process.version}`,
        `**Discord.js Version:** v${version}`
      ].join("\n"))
      .addField("Command Stats", [
        `**Total Commands:** ${this.store.size}`,
        `**Commands Ran:** ${this.store.ran}`,
        `**Most Used:** ${mostUsed}`
      ].join("\n"))
      .addField("Links", [
        ":star: [GitHub Repository](https://github.com/ravener/miyako)",
        ":robot: [Upvote me at top.gg](https://top.gg/bot/397796982120382464)",
        ":envelope_with_arrow: [Invite me to your server](https://discordapp.com/oauth2/authorize?client_id=397796982120382464&permissions=2016537702&scope=bot)",
        ":video_game: [Join our Discord Server](https://discord.gg/mDkMbEh)"
      ].join("\n")));
  }
}

module.exports = Stats;
