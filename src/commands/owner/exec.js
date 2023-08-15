import Command from '../../structures/Command.js';
import { promisify } from 'node:util';
import { request } from 'undici';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);

class Exec extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Executes commands on the shell.',
      ownerOnly: true,
      modes: ['text']
    });
  }

  async run(ctx) {
    const result = await execAsync(ctx.args.join(' '), { timeout: 60000 })
      .catch(error => ({ stdout: null, stderr: error }));

    const output = result.stdout ? `**\`OUTPUT\`**${'```prolog\n' + result.stdout + '```'}` : '';
    const outerr = result.stderr ? `**\`ERROR\`**${'```prolog\n' + result.stderr + '```'}` : '';

    if (output === '' && outerr === '') {
      return ctx.reply('No output returned.');
    }

    const results = [output, outerr].join('\n');

    if (results.length > 2000) {
      return ctx.reply(`Output too long, pasted at ${this.paste(results)}`);
    }

    return ctx.reply(results);
  }

  async paste(content) {
    const { body } = await request('https://ravener.vercel.app/api/paste', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.PASTEBIN
      },
      body: JSON.stringify({ content })
    });

    const { id } = await body.json();
    return `https://ravener.vercel.app/paste/${id}`;
  }
}

export default Exec;
