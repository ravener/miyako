const Command = require("../../structures/Command.js");
const { request } = require("undici");

class Wikipedia extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["wiki"],
      description: "Finds a Wikipedia Article by title.",
      usage: "wikipedia <query>",
      options: [
        {
          name: "query",
          description: "The query to lookup.",
          type: "string",
          required: true
        }
      ]
    });
  }
  
  async run(ctx, options) {
    const query = options.getString("query");

    const article = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, "_"))}`, {
      maxRedirections: 1
    })
      .then(({ body }) => body.json())
      .catch(() => {
        throw "I couldn't find a wikipedia article with that title!";
      });
    
    if (!article.content_urls) {
      throw "I couldn't find a wikipedia article with that title!";
    }

    const embed = this.client.embed(ctx.author)
      .setThumbnail("https://i.imgur.com/fnhlGh5.png")
      .setURL(article.content_urls.desktop.page)
      .setTitle(article.title)
      .setDescription(article.extract);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Wikipedia;
