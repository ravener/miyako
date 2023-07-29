import Command from '../../structures/Command.js';
import { request } from 'undici';

class OwO extends Command {
  constructor(...args) {
    super(...args, {
      description: 'OwO What is this?',
      cooldown: 3,
      aliases: ['owoify', 'uwu', 'uwuify'],
      usage: 'owo <text>',
      options: [
        {
          name: 'text',
          description: 'Text to owoify',
          type: 'string',
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const text = options.getString('text');

    // The reply is exactly what the API gives, to minimize requests we handle that condition ourselves.
    if (!text || text.length > 200) {
      return ctx.reply('oopsie whoopsie you made a fucky wucky, no text or text over 200');
    }

    const { owo } = await request(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(text)}`)
      .then(({ body }) => body.json());

    return ctx.reply(owo);
  }
}

export default OwO;
