const { Command } = require("klasa");

class Hackban extends Command {
  constructor(...args) {
    super(...args, {
      description: "Bans a user that isn't in the server.",
      permissionLevel: 5,
      aliases: ["hban"],
      requiredPermissions: ["BAN_MEMBERS"],
      usage: "<username:username|id:string> [reason:string] [...]",
      usageDelim: " ",
      runIn: ["text"]
    });
  }
  
  async run(msg, [id, ...reason]) {
    if(id.id) id = id.id;
    if(isNaN(parseInt(id))) throw "Invalid user id.";
    if(msg.guild.members.has(id)) throw `That user is in the server, hackban is meant to ban people who isn't in the server to prevent them from (re)joining in the future, use \`${msg.guild.settings.prefix}ban\` for that user.`;
    return msg.guild.members.ban(id, { reason: reason.join(" ") }).then((res) => {
      return msg.send(`Hackbanned **${res.tag}** (${res.id})`);
    }).catch(() => msg.send("Couldn't ban that user, make sure the ID is valid."));
  }
}

module.exports = Hackban;
