const { Command } = require("klasa");

class DM extends Command {
  constructor(...args) {
    super(...args, {
      description: "DMs someone",
      permissionLevel: 10,
      usage: "<user:username> <message:...string>",
      usageDelim: " ",
      quotedStringSupport: true,
      aliases: ["pm"]
    });
  }

  async run(msg, [user, message]) {
    return user.send(message)
      .then(() => {
        return msg.send(`DMed your message to **${user.tag}**`);
      })
      .catch((err) => {
        if(err.status === 403) return msg.send("I cannot DM that user, they probably have DMs blocked.");
        throw err;
      });
  }
}

module.exports = DM;
