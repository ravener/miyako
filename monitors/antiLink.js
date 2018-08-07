const { Monitor } = require("klasa");

class AntiLink extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreEdits: false,
      ignoreBlacklistedUsers: false,
      ignoreOthers: false
    });
    this.regex = /(?:https?:\/\/)?(?:www\.)?(discord\.gg|discord\.me|discord\.io|discordapp\.com\/invite)\/(\S+)/i;
  }
  
  async run(message) {
    if(!message.guild || !message.guild.configs.automod.invites) return;
    if(await message.hasAtLeastPermissionLevel(5)) return;
    const match = message.content.match(this.regex);
    if(!match) return;
    if(message.deletable) {
      await message.delete();
      this.client.emit("modlogs", message.guild, "inviteDelete", { name: "invites", message, link: { base: match[1], code: match[2] } });
    }
    const msg = await message.reply("❌ No advertising.");
    await msg.delete({ timeout: 3000 });
  }
  
  async init() {
    const { schema } = this.client.gateways.guilds;
    if(!schema.has("automod")) {
      await schema.add("automod", {});
    }
    if(!schema.automod.has("invites")) {
      await schema.automod.add("invites", { type: "boolean" });
    }
  }
}

module.exports = AntiLink;