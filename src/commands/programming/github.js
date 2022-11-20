const Command = require("../../structures/Command.js");
const { request } = require("undici");

class GitHub extends Command {
  constructor(...args) {
    super(...args, {
      description: "View a GitHub repository details.",
      aliases: ["gh"],
      usage: "github ravener/miyako",
      cooldown: 3,
      options: [
        {
          name: "repo",
          description: "The repository in the format username/repository",
          type: "string",
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const repo = options.getString("repo");

    if (!repo) {
      return ctx.reply("What repository am I supposed to show you?");
    }

    const [username, repository] = repo.split("/");
    if (!username || !repository) return ctx.reply("Repository must be in the form `username/repository`");

    const body = await request(`https://api.github.com/repos/${username}/${repository}`, {
      headers: { "User-Agent": "miyako https://github.com/ravener/miyako" }
    })
      .then(({ body, statusCode }) => statusCode === 200 && body.json())
      .catch(() => null)

    if (!body) return ctx.reply("Could not fetch that repo, are you sure it exists?");

    const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
    const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || "None";
    const footer = [];
    if (body.fork) footer.push(`❯ **Forked** from [${body.parent.full_name}](${body.parent.html_url})`);
    if (body.archived) footer.push("❯ This repository is **Archived**");

    const embed = this.client.embed()
      .setTitle(body.full_name)
      .setAuthor({
        name: "GitHub",
        iconURL: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      })
      .setURL(body.html_url)
      .setThumbnail(body.owner.avatar_url)
      .setDescription(`${body.description || "No Description."}\n\n❯ **Language:** ${body.language}\n❯ **Forks:** ${body.forks_count.toLocaleString()}\n❯ **License:** ${license}\n❯ **Open Issues:** ${body.open_issues.toLocaleString()}\n❯ **Watchers:** ${body.subscribers_count.toLocaleString()}\n❯ **Stars:** ${body.stargazers_count.toLocaleString()}\n❯ **Size:** ${size}${footer.length ? `\n${footer.join("\n")}` : ""}`);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = GitHub;
