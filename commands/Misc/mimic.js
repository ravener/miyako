const { Command } = require("klasa");
const { clean } = require("../../utils/utils.js");

class Mimic extends Command {
  constructor(...args) {
    super(...args, {
      description: "Copy someone and talk as them.",
      aliases: ["copycat"],
      requiredPermissions: ["MANAGE_WEBHOOKS"],
      usage: "<member:member|user:user> <message:...string>",
      usageDelim: " ",
      runIn: ["text"],
      permissionLevel: 4
    });
  }

  async run(msg, [user, message]) {
    if(msg.deletable) await msg.delete().catch(() => null);
    const name = user.displayName || user.username;
    const avatar = user.user ? user.user.displayAvatarURL({ format: "png", size: 2048 }) : user.displayAvatarURL({ format: "png", size: 2048 });
    const webhook = await msg.channel.createWebhook(name, { avatar });
    await webhook.send(clean(msg, message));
    await webhook.delete();
  }
}

module.exports = Mimic;
