const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class APIStats extends Command {
  constructor(...args) {
    super(...args, {
      description: "View statistics about the IMG API process.",
      ownerOnly: true,
      aliases: ["imgapi", "imgapistats"]
    });
  }

  async run(ctx) {
    // Ping
    const before = Date.now();
    await this.client.img.ping();
    const after = Date.now() - before;
    
    // Get stats
    const { goroutines, version, uptime, stats } = await this.client.img.stats(true);
    
    const embed = new MessageEmbed()
      .setTitle("IMG API Stats")
      .setColor(0x9590EE)
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
      .addField("Version", `v${version}`, true)
      .addField("Ping", `${after} ms`)
      .addField("Uptime", this.client.utils.getDuration(uptime * 1000))
      .addField("Memory Stats", [
        `**Used:** ${this.client.utils.getBytes(stats.Alloc)} / ${this.client.utils.getBytes(stats.Sys)}`,
        `**Garbage Collected:** ${this.client.utils.getBytes(stats.TotalAlloc - stats.Alloc)}`,
        `**GC Cycles:** ${stats.NumGC}`,
        `**Forced GC Cycles:** ${stats.NumForcedGC}`,
        `**Next GC Target:** ${this.client.utils.getBytes(stats.NextGC)}`,
        `**Goroutines:** ${goroutines}`
      ].join("\n"));

    return ctx.reply({ embed });
  }
}

module.exports = APIStats;
