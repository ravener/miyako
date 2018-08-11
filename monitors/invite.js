const { Monitor } = require("klasa");

class Invite extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreEdits: false,
      ignoreBlacklistedUsers: false,
      ignoreOthers: false
    });
    this.regex = /(?:https?:\/\/)?(?:www\.)?(discord\.gg|discord\.io|discord\.me|discordapp\.com\/invite)\/(\S+)/i;
  }
  
  async run(message) {
    if(!message.guild || !message.guild.settings.modlogs.invites) return;
    const match = message.content.match(this.regex);
    if(!match) return;
    let data = null;
    if(match[1] === "discord.gg" || match[1] === "discordapp.com/invite") {
      data = await this.client.fetchInvite(`https://discord.gg/${match[2]}`).catch(() => null);
    }
    this.client.emit("modlogs", message.guild, "invite", { name: "invites", message, link: { base: match[1], code: match[2], data } });
  }
}

module.exports = Invite;