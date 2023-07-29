import Command from '../../structures/Command.js';
import { request } from 'undici';

class ChuckNorris extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['chucknorrisjoke'],
      description: 'Chuck Norris has some good jokes.',
      cooldown: 3,
      usage: 'chucknorris [@user]',
      options: [
        {
          name: 'user',
          type: 'user',
          description: 'If given, mention the user instead of Chuck Norris\' name.'
        }
      ]
    });
  }

  async run(ctx, options) {
    const user = options.getUser('user');

    const { value } = await request('https://api.chucknorris.io/jokes/random')
      .then(({ body }) => body.json());

    return ctx.reply({
      content: user ? value.replace(/Chuck Norris/g, user.toString()) : value
    });
  }
}

export default ChuckNorris;
