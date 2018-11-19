const { Route } = require("klasa-dashboard-hooks");
const { WebhookClient, MessageEmbed } = require("discord.js");

class Upvote extends Route {
  constructor(...args) {
    super(...args, {
      route: "upvote"
    });
    this.webhook = new WebhookClient(...this.client.config.upvoteWebhook);
  }

  async post(req, res) {
    if(req.headers["authorization"] !== this.client.config.dbl) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    res.end();
    this.client.upvoters.add(req.body.user);
    const user = await this.client.users.fetch(req.body.user).catch(() => null);
    if(!user) return;
    const guild = this.client.guilds.get(this.client.constants.mainGuild);
    const embed = new MessageEmbed()
      .setTitle("Upvote")
      .setDescription(`${guild.members.has(user.id) ? user.toString() : user.tag} has upvoted Ladybug. :heart: Thanks for the support.`)
      .setColor(0xff0000)
      .setAuthor(user.tag, user.displayAvatarURL());
    return this.webhook.send(embed);
  }
}

module.exports = Upvote;
