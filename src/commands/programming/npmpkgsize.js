const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class NPMPkgSize extends Command {
  constructor(...args) {
    super(...args, {
      description: "Shows the install/publish size of a npm package.",
      usage: "npmpkgsize express",
      aliases: ["pkgsize", "npmsize", "packagephobia"],
      cooldown: 5
    });
  }
  
  async run(msg, [name]) {
    if (!name) return msg.send("Baka! What package am I supposed to show you?");
    
    const { publishSize, installSize } = await fetch(`https://packagephobia.now.sh/api.json?p=${encodeURIComponent(name)}`)
      .then(res => res.json());
    
    if (!publishSize && !installSize) return msg.send("That package doesn't exist.");

    const embed = this.client.embed(msg.author)
      .setTitle(`NPM Package Size - ${name}`)
      .setDescription(`**Publish Size:** ${this.client.utils.getBytes(publishSize)}\n**Install Size:** ${this.client.utils.getBytes(installSize)}`)
      .setFooter("Powered by packagephobia.now.sh");
    
    return msg.send({ embed });
  }
}

module.exports = NPMPkgSize;
