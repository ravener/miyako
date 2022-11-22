const Command = require("../../structures/Command.js");
const { request } = require("undici");

class Anime extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search an Anime on Kitsu.io",
      usage: "anime <title>, [page]",
      cooldown: 5,
      delim: ", ",
      options: [
        {
          name: "title",
          description: "Title of the anime.",
          type: "string",
          required: true
        },
        {
          name: "page",
          description: "The page of the results to view.",
          type: "integer"
        }
      ]
    });
  }

  async run(ctx, options) {
    const title = options.getString("title");
    const page = options.getInteger("page") ?? 1;

    const { data } = await request(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`)
      .then(({ body }) => body.json());

    if (!data || !data.length) return ctx.reply("No results found.");

    const res = data[page - 1];
    if (!res) return ctx.reply(`Invalid page ${page} there is only ${data.length} pages.`);
    
    const embed = this.client.embed(ctx.author)
      .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (Japanese: ${res.attributes.titles.en_jp})` : res.attributes.titles.en_jp)
      .setDescription(res.attributes.synopsis)
      .addFields({
        name: "Age Rating",
        value: `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ""}`,
        inline: true
      })
      .addFields({
        name: "Episodes",
        value: `${res.attributes.episodeCount} (${res.attributes.episodeLength} Min Per Episode)`,
        inline: true
      })
      .addFields({
        name: "Date Aired",
        value: `**Start:** ${res.attributes.startDate}\n**End:** ${res.attributes.endDate}`
      })
      .setImage(res.attributes.coverImage && res.attributes.coverImage.original)
      .setThumbnail(res.attributes.posterImage && res.attributes.posterImage.original)
      .setURL(`https://kitsu.io/anime/${res.id}`)
      .setFooter({ text: `Page ${page}/${data.length}` });

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Anime;
