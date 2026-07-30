import Command from '../../structures/Command.js';
import { request } from 'undici';
import type { RequestOptions } from '../../types.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

interface WikipediaArticle {
  content_urls?: { desktop: { page: string } };
  title: string;
  extract: string;
}

class Wikipedia extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      aliases: ['wiki'],
      description: 'Finds a Wikipedia Article by title.',
      usage: 'wikipedia <query>',
      options: [
        {
          name: 'query',
          description: 'The query to lookup.',
          type: 'string',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const query = options.getString('query');

    const article = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`, {
      maxRedirections: 1
    } as unknown as RequestOptions)
      .then(({ body }) => body.json() as Promise<WikipediaArticle>)
      .catch(() => {
        throw 'I couldn\'t find a wikipedia article with that title!';
      });

    if (!article.content_urls) {
      throw 'I couldn\'t find a wikipedia article with that title!';
    }

    const embed = this.client.embed(ctx.author)
      .setThumbnail('https://i.imgur.com/fnhlGh5.png')
      .setURL(article.content_urls.desktop.page)
      .setTitle(article.title)
      .setDescription(article.extract);

    return ctx.reply({ embeds: [embed] });
  }
}

export default Wikipedia;
