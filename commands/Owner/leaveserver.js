const { Command } = require("klasa");

class Leave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Makes bot leave a server, owner only",
      permissionLevel: 10,
      aliases: ["leaveguild", "leaveg"],
      usage: "<guild:leaveserver>"
    });
    
    this.createCustomResolver("leaveserver", (arg, possible, msg) => {
      if(["this", "current"].includes(arg.toLowerCase())) return msg.guild;
      return this.client.arguments.get("guildname").run(arg, possible, msg);
    });
  }
  
  async run(msg, [guild]) {
    const res = await msg.prompt(`Are you sure you want me to leave **${guild.name}** (${guild.id})?`);
    switch(res.content.toLowerCase()) {
      case "yes":
      case "y":
        return guild.leave().then((g) => g.id === msg.guild.id ? msg.author.send(`Left **{g.name}** (${g.id})`) : msg.send(`Left **${g.name}** (${g.id})`));
      case "n":
      case "no":
        return msg.send("Cancelled.");
      default:
        return msg.send("Invalid choice, cancelled.");
    }
  }
}

module.exports = Leave;