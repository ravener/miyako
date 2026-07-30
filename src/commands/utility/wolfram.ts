import Command from '../../structures/Command.js';
import { request } from 'undici';
import { toProperCase } from '../../utils/utils.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

interface WolframPod {
  error?: unknown;
  subpods: { plaintext: string }[];
}

class Wolfram extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Query Wolfram Alpha with any mathematical question.',
      usage: 'wolfram <query>',
      aliases: ['what', 'when', 'where', 'who', 'why', 'how', 'define'],
      cooldown: 5,
      options: [
        {
          name: 'query',
          description: 'The query to ask wolfram about.',
          type: 'string',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    // Allow users to trigger this in a fancy way using @Miyako What time is it?
    // If they invoke it with the "what"/"where"/"when"/"who"/"why" alias, we must also treat it as an argument.
    // A trick to make it look like some advanced A.I bot I guess.
    const query = this.aliases.includes(ctx.alias) ? `${toProperCase(ctx.alias)} ${options.getString('query')}` : options.getString('query');

    const url = new URL('http://api.wolframalpha.com/v2/query');
    url.search = new URLSearchParams([
      ['input', query],
      ['primary', true],
      ['appid', process.env.WOLFRAM],
      ['output', 'json']
    ] as unknown as [string, string][]) as unknown as string;

    const pods = await request(url)
      .then(({ body }) => body.json() as Promise<{ queryresult: { pods: WolframPod[] & { error?: unknown } } }>)
      .then((body) => body.queryresult.pods);

    if (!pods || pods.error) return ctx.reply('Couldn\'t find an answer to that question!');
    const description = pods[1].subpods[0].plaintext.substring(0, 1980);

    const embed = this.client.embed()
      .setTitle(pods[0].subpods[0].plaintext);

    if (description) embed.setDescription(description);

    return ctx.reply({ embeds: [embed] });
  }
}

export default Wolfram;
