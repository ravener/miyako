const { Command } = require("klasa");

class MyLevel extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns your permission level",
      aliases: ["permlevel", "mypermlevel", "permissionslevel", "permissionlevel"],
      runIn: ["text"]
    });

    this.levels = {
      0: "User",
      2: "Premium",
      4: "Mini Server Moderator",
      5: "Server Moderator",
      6: "Server Manager",
      7: "Server Administrator",
      8: "Server Owner",
      9: "Bot Owner",
      10: "Bot Owner"
    };
  }

  async run(msg) {
    let perm;
    for (let level = this.client.permissionLevels.size; level >= 0; level--) {
      if(!await msg.hasAtLeastPermissionLevel(level)) continue;
      perm = level;
      break;
    }
    return msg.send(`You permission level is **${perm}: ${this.levels[perm]}**`);
  }
}

module.exports = MyLevel;
