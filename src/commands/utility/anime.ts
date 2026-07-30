import Command from '../../structures/Command.js';
import { request } from 'undici';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

interface KitsuAnime {
  id: string;
  attributes: {
    titles: { en?: string; en_jp?: string };
    synopsis: string;
    ageRating: string;
    ageRatingGuide?: string;
    episodeCount: number;
    episodeLength: number;
    startDate: string;
    endDate: string;
    coverImage?: { original: string };
    posterImage?: { original: string };
  };
}

class Anime extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Search an Anime on Kitsu.io',
      usage: 'anime <title>, [page]',
      cooldown: 5,
      delim: ', ',
      options: [
        {
          name: 'title',
          description: 'Title of the anime.',
          type: 'string',
          required: true
        },
        {
          name: 'page',
          description: 'The page of the results to view.',
          type: 'integer'
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const title = options.getString('title');
    const page = options.getInteger('page') ?? 1;

    const { data } = await request(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}`)
      .then(({ body }) => body.json() as Promise<{ data: KitsuAnime[] }>);

    if (!data || !data.length) return ctx.reply('No results found.');

    const res = data[page - 1];
    if (!res) return ctx.reply(`Invalid page ${page} there is only ${data.length} pages.`);

    const embed = this.client.embed(ctx.author)
      .setTitle(res.attributes.titles.en ? `${res.attributes.titles.en} (Japanese: ${res.attributes.titles.en_jp})` : res.attributes.titles.en_jp!)
      .setDescription(res.attributes.synopsis)
      .addFields({
        name: 'Age Rating',
        value: `${res.attributes.ageRating}${res.attributes.ageRatingGuide ? ` (${res.attributes.ageRatingGuide})` : ''}`,
        inline: true
      })
      .addFields({
        name: 'Episodes',
        value: `${res.attributes.episodeCount} (${res.attributes.episodeLength} Min Per Episode)`,
        inline: true
      })
      .addFields({
        name: 'Date Aired',
        value: `**Start:** ${res.attributes.startDate}\n**End:** ${res.attributes.endDate}`
      })
      .setImage((res.attributes.coverImage && res.attributes.coverImage.original) as string)
      .setThumbnail((res.attributes.posterImage && res.attributes.posterImage.original) as string)
      .setURL(`https://kitsu.io/anime/${res.id}`)
      .setFooter({ text: `Page ${page}/${data.length}` });

    return ctx.reply({ embeds: [embed] });
  }
}

export default Anime;
