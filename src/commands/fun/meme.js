import Command from '../../structures/Command.js';
import { request } from 'undici';
import { random } from '../../utils/utils.js';

class Meme extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get a random meme from r/dankmemes',
      cooldown: 5,
      aliases: ['memes', 'dankmemes'],
      cost: 5
    });
  }

  async run(ctx) {
    const { data: { children } } = await request('https://www.reddit.com/r/dankmemes/top.json?sort=top&t=day&limit=500')
      .then(({ body }) => body.json());

    const { data } = random(children);
    const embed = this.client.embed(ctx.author)
      .setTitle(data.title)
      .setImage(data.url)
      .setFooter({
        text: `👍 ${data.ups} | 👎 ${data.downs}`
      });

    return ctx.reply({ embeds: [embed] });
  }
}

export default Meme;
