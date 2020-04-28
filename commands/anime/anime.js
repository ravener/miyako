const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Anime extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search an Anime on Kitsu.io",
      usage: "anime <title>, [page]",
      cooldown: 5
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What Anime am I supposed to search for?");
    let [title, page = 1] = args.join(" ").split(", ");
    page = this.verifyInt(page, 1);

    const { data } = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`)
      .then((r) => r.json());

    if(!data || !data.length) return ctx.reply("No results found.");

    const res = data[page - 1];
    if(!res) return ctx.reply(`Invalid page ${page} there is only ${data.length} pages.`);
    
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setTitle(`${res.attributes.titles.en} (Japanese: ${res.attributes.titles.en_jp})`)
      .setDescription(res.attributes.synopsis)
      .addField("Age Rating", `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ""}`)
      .addField("Episodes", `${res.attributes.episodeCount} (${res.attributes.episodeLength} Min Per Episode)`)
      .setImage(res.attributes.coverImage.original)
      .setThumbnail(res.attributes.posterImage.original)
      .setURL(`https://kitsu.io/anime/${res.id}`);

    return ctx.reply({ embed });
  }
}

module.exports = Anime;
