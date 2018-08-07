const { Command } = require("klasa");

class Support extends Command {
  constructor(...args) {
    super(...args, {
      description: "Sends link to our discord server.",
      aliases: ["discord", "server"]
    });
  }
  
  async run(msg) {
    return msg.author.send("Here is the invite to our server: https://discord.gg/mDkMbEh").then(() => {
      if(msg.channel.type !== "dm") return msg.send("Sent the invite in your DMs!");
    }).catch(() => msg.send("Couldn't DM invite, make sure you didn't block DMs from this server."));
  }
}

module.exports = Support;