const { Monitor } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { embedContains } = require("../utils/utils.js");

class Token extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreBlacklistedUsers: false,
      ignoreBlacklistedGuilds: false,
      ignoreBots: false,
      ignoreOthers: false,
      ignoreEdits: false,
      ignoreSelf: false
    });
  }
  
  async run(msg) {
    const token = msg.content.includes(this.client.token);
    const maybeEmbed = msg.embeds.length ? embedContains(msg.embeds[0], this.client.token) : false;
    if(!token && !maybeEmbed) return;
    const channel = this.client.channels.get(this.client.constants.logsChannel);
    let deleted = false;
    if(msg.deletable) {
      await msg.delete();
      deleted = true;
    }
    const embed = new MessageEmbed()
      .setTitle("TOKEN COMPROMISED")
      .setDescription(`Token sent by **${msg.author.tag} (${msg.author.id})**\nRESET IMMEDIATELY https://discordapp.com/developers/applications/me/${this.client.user.id}`)
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setFooter(msg.author.id)
      .addField("Server", msg.guild ? msg.guild.name : "DM")
      .addField("Deleted", deleted ? "Yes" : "Couldn't delete");
    return channel.send(`<@${this.client.constants.ownerID}> IMPORTANT`, { embed });
  }
}

module.exports = Token;