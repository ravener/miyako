const Command = require("../../structures/Command.js");
const { request } = require("undici");

class NPM extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search the NPM Registry for a package information",
      usage: "npm <package>",
      aliases: ["npmpackage", "npmpkg", "nodepackagemanager"],
      cooldown: 5,
      options: [
        {
          name: "package",
          description: "The package name to view.",
          type: "string",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const pkg = options.getString("package");

    const body = await request(`https://registry.npmjs.com/${pkg}`)
      .then(({ body, statusCode }) => {
        if (statusCode === 404) throw "No results found.";
        return body.json();
      });

    const version = body.versions[body["dist-tags"].latest];
    let deps = version.dependencies ? Object.keys(version.dependencies) : null;
    let maintainers = body.maintainers.map((user) => user.name);

    if (maintainers.length > 10) {
      const len = maintainers.length - 10;
      maintainers = maintainers.slice(0, 10);
      maintainers.push(`...${len} more.`);
    }

    if (deps && deps.length > 10) {
      const len = deps.length - 10;
      deps = deps.slice(0, 10);
      deps.push(`...${len} more.`);
    }

    const embed = this.client.embed(ctx.author)
      .setTitle(`NPM - ${pkg}`)
      .setURL(`https://npmjs.com/package/${pkg}`)
      .setDescription([
        body.description || "No Description.",
        "",
        `**Version:** ${body["dist-tags"].latest}`,
        `**License:** ${body.license}`,
        `**Author:** ${body.author ? body.author.name : "Unknown"}`,
        `**Modified:** ${new Date(body.time.modified).toDateString()}`,
        `**Dependencies:** ${deps && deps.length ? deps.join(", ") : "None"}`
      ].join("\n"));

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = NPM;
