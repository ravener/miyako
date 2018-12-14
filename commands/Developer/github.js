const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const ladybug = require("ladybug-fetch");

class GitHub extends Command {
  constructor(...args) {
    super(...args, {
      description: "View a GitHub repository details.",
      aliases: ["gh"],
      usage: "<repo:repo>",
      cooldown: 3
    });

    this.createCustomResolver("repo", (arg) => {
      const [name, repo] = arg.split("/");
      if(!name || !repo)
        throw "Invalid repository, it must be in format `username/repository`";
      return `${name}/${repo}`;
    });
  }

  async run(msg, [repo]) {
    const res = await ladybug(`https://api.github.com/repos/${repo}`)
      .catch(() => null);
    if(!res) throw "Could not fetch that repo, are you sure it exists?";
    const { body } = res;
    const size = body.size < 1000 ? `${body.size} KB` : Math.floor(body.size / 1000) > 1000 ? `${(body.size / 1000 / 1000).toFixed(2)} GB` : `${(body.size / 1000).toFixed(2)} MB`;
    const license = body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license.name || "None";
    const footer = [];
    if(body.fork) footer.push(`❯ **Forked** from [${body.parent.full_name}](${body.parent.html_url})`);
    if(body.archived) footer.push("❯ This repository is **Archived**");
    const embed = new MessageEmbed()
      .setTitle(body.full_name)
      .setColor(0xFF0000)
      .setAuthor("GitHub", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
      .setURL(body.html_url)
      .setThumbnail(body.owner.avatar_url)
      .setDescription(`${body.description}\n\n❯ **Language:** ${body.language}\n❯ **Forks:** ${body.forks_count.toLocaleString()}\n❯ **License:** ${license}\n❯ **Open Issues:** ${body.open_issues.toLocaleString()}\n❯ **Watchers:** ${body.watchers_count.toLocaleString()}\n❯ **Stars:** ${body.stargazers_count.toLocaleString()}\n❯ **Clone Size:** ${size}${footer.length ? footer.join("\n") : ""}`);
    return msg.send({ embed });
  }
}

module.exports = GitHub;
