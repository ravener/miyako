const Monitor = require("../structures/Monitor.js");

class Token extends Monitor {

  async run(msg) {
    const token = msg.content.includes(this.client.token);
    let maybeEmbed = false;

    if (!token) maybeEmbed = msg.embeds.length ?
      this.client.utils.embedContains(msg.embeds[0], this.client.token) : false;

    if(!token && !maybeEmbed) return;

    const channel = this.client.channels.cache.get("454776836929617921");
    let deleted = false;

    if (msg.deletable) {
      await msg.delete();
      deleted = true;
    }

    const embed = this.client.embed(msg.author)
      .setTitle("TOKEN COMPROMISED")
      .setDescription(`Token sent by **${msg.author.tag} (${msg.author.id})**\nRESET IMMEDIATELY https://discordapp.com/developers/applications/me/${this.client.user.id}`)
      .setColor(0xFF0000)
      .setFooter(msg.author.id)
      .addField("Server", msg.guild ? `${msg.guild.name} (${msg.guild.id})` : "DM")
      .addField("Channel", `${msg.channel.name} (${msg.channel.id})`)
      .addField("Deleted", deleted ? "Yes" : "Couldn't delete");

    return channel.send(`<@${this.client.constants.ownerID}> IMPORTANT`, { embed });
  }
}

module.exports = Token;
