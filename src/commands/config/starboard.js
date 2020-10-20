const Command = require("../../structures/Command.js");

class Starboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "Configure the server starboard.",
      extendedHelp: "The starboard is a channel where when users add a star reaction to messages it will be posted there. It is used to highlight funny/embarassing/dumb moments and such. You can set a limit to avoid messages below the limit to be posted in the starboard channel.",
      usage: "starboard limit <amount> | enable <#channel> | disable",
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true
    });
  }

  async run(msg, [action, amount]) {
    if(!action) return msg.send("Baka! Specify one of `enable #channel`, `disable` or `limit <amount>`");

    if(action === "disable") {
      await msg.guild.update({ starboard: { channel: null } });
      return msg.send("Successfully disabled the server starboard.");
    }

    if(action === "enable") {
      if(!msg.mentions.channels.size) return msg.send("Baka! Specify the channel you want to enable it on.");
      const channel = msg.mentions.channels.first();
      await msg.guild.update({ starboard: { channel: channel.id } });
      return msg.send(`Successfully enabled the server starboard for the channel ${channel}`);
    }

    if(action === "limit") {
      amount = this.verifyInt(amount);
      if(amount < 1) return msg.send("Baka! Limit cannot be less than 1");
      if(amount > msg.guild.memberCount) return msg.send("Baka! Limit cannot be more than the amount of members in the server.");
      await msg.guild.update({ starboard: { limit: amount } });
      return msg.send(`Successfully updated the starboard star limit to ${amount}`);
    }

    return msg.send("Baka! Invalid action. Specify one of `enable #channel`, `disable` or `limit <amount>`");
  }
}

module.exports = Starboard;
