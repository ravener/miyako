const { Command } = require("klasa");

class Leave extends Command {
  constructor(...args) {
    super(...args, {
      description: "Makes bot leave a server, owner only",
      permissionLevel: 10,
      aliases: ["leaveguild", "leaveg"],
      usage: "<guild:guild|guild:string>"
    });
  }
  
  async run(msg, [guild]) {
    if(["this", "current"].includes(guild)) guild = msg.guild;
    if(typeof guild === "string") throw msg.language.get("RESOLVER_INVALID_GUILD", "guild");
    const res = await msg.prompt(`Are you sure you want me to leave ${guild.name} (${guild.id})?`);
    switch(res.content.toLowerCase()) {
      case "yes":
      case "y":
        return guild.leave().then((g) => msg.send(`Left ${g.name} (${g.id})`));
      case "n":
      case "no":
        return msg.send("Cancelled.");
      default:
        return msg.send("Invalid choice, cancelled.");
    }
  }
}

module.exports = Leave;