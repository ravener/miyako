const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const ladybug = require("ladybug-fetch");

class NPM extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search the NPM Registry for a package information",
      usage: "<package:string>",
      aliases: ["npmpackage", "npmpkg", "nodepackagemanager"],
      cooldown: 5
    });
  }

  async run(msg, [pkg]) {
    const { body } = await ladybug(`https://registry.npmjs.com/${pkg}`)
      .catch((err) => {
        if(err.status === 404) throw "No results found.";
        throw err;
      });

    const version = body.versions[body["dist-tags"].latest];

    let deps = version.dependencies ? Object.keys(version.dependencies) : null;
    let maintainers = body.maintainers.map((user) => user.name);

    if(maintainers.length > 10) {
      const len = maintainers.length - 10;
      maintainers = maintainers.slice(0, 10);
      maintainers.push(`...${len} more.`);
    }

    if(deps && deps.length > 10) {
      const len = deps.length - 10;
      deps = deps.slice(0, 10);
      deps.push(`...${len} more.`);
    }

    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`NPM - ${pkg}`)
      .setURL(`https://npmjs.com/package/${pkg}`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription([
        body.description || "No Description.",
        `**Version:** ${body["dist-tags"].latest}`,
        `**License:** ${body.license}`,
        `**Author:** ${body.author ? body.author.name : "Unknown"}`,
        `**Modified:** ${new Date(body.time.modified).toDateString()}`,
        `**Dependencies:** ${deps && deps.length ? deps.join(", ") : "None"}`
      ].join("\n"));

    return msg.send({ embed });
  }
}

module.exports = NPM;
