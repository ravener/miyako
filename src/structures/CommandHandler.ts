import CommandContext from './CommandContext.js';
import { distance } from 'fastest-levenshtein';
import { plural, missingPermissions, getDuration, random } from '../utils/utils.js';
import RateLimiter from './RateLimiter.js';
import { cooldown } from '../utils/responses.js';
import type { Message, Interaction, TextChannel } from 'discord.js';
import type MiyakoClient from './MiyakoClient.js';
import type Command from './Command.js';

const quotes = ['"', '\'', '“”', '‘’'];
const flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map((qu) => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join('|')}|([\\w<>@#&!-]+)))?`, 'g');
const delim = new RegExp('(\\s)(?:\\s)+');

class CommandHandler {
  client: MiyakoClient;
  ratelimiter: RateLimiter;

  constructor(client: MiyakoClient) {
    this.client = client;
    this.ratelimiter = new RateLimiter();
  }

  getFlags(content: string): { content: string; flags: Record<string, string> } {
    const flags: Record<string, string> = {};
    content = content.replace(flagRegex, (match, fl: string, ...quote: any[]) => {
      flags[fl] = (quote.slice(0, -2).find((el) => el) || fl).replace(/\\/g, '');
      return '';
    }).replace(delim, '$1');

    return { content, flags };
  }

  async handleMessage(message: Message) {
    if (!message.content || message.author.bot) return;
    if ((message.channel as { partial?: boolean }).partial) await message.channel.fetch();

    const { user } = this.client;
    const regex = new RegExp(`<@!?${user!.id}>${!message.guild ? '|' : ''}`);
    const match = message.content.match(regex);

    if (!match) return;

    const prefixLength = match[0].length;
    const rawContent = message.content.slice(prefixLength).trim();

    // A mention only.
    if (!rawContent) {
      return (message.channel as TextChannel).send('👋 Hi there! Run `@Miyako help` to see all I can do or browse the slash commands by typing `/`');
    }

    const { content, flags } = this.getFlags(rawContent);
    const args = content.split(/ +/g);
    const alias = args.shift()!.toLowerCase();
    const command = this.client.commands.get(alias);

    const ctx = new CommandContext(command, {
      message, flags, content,
      prefixLength, alias, args
    });

    if (!command) return this.closestCommand(ctx, alias);
    if (!command.modes.includes('text')) return;
    if (!(await this.runChecks(ctx, command))) return;

    return command.execute(ctx);
  }

  async handleInteraction(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = this.client.commands.get(interaction.commandName);

    if (!command) {
      this.client.log.warn(`Command '${interaction.commandName}' not implemented.`);
      return interaction.reply({
        content: 'This command has not been implemented, this is a bug.',
        ephemeral: true
      });
    }

    const ctx = new CommandContext(command, { interaction });
    if (!(await this.runChecks(ctx, command))) return;
    return command.execute(ctx);
  }

  async runChecks(ctx: CommandContext, command: Command): Promise<boolean> {
    if (command.ownerOnly && !ctx.owner) {
      await ctx.reply({
        content: 'This command can only be used by the owner.'
      });

      return false;
    }

    if (command.guildOnly && !ctx.guild) {
      await ctx.reply({
        content: 'Ba-baka! What do you think you\'re doing in my DMs? That command can only be used in a server!'
      });

      return false;
    }

    if (!(await this.checkPermissions(ctx, command))) return false;
    if (!(await this.checkCooldown(ctx, command))) return false;

    return true;
  }

  async checkPermissions(ctx: CommandContext, command: Command): Promise<boolean> {
    if (!ctx.guild) return true;
    const permissions = (ctx.channel as TextChannel).permissionsFor(this.client.user!);
    const missing = missingPermissions(permissions!, command.botPermissions);

    if (missing.length) {
      await ctx.reply({
        content: `I need the following permission${plural(missing)} to run that command: **${missing.join(', ')}**`
      });

      return false;
    }

    if (ctx.owner) return true;
    if (ctx.slash) return true;

    const userPermissions = (ctx.channel as TextChannel).permissionsFor(ctx.author);
    const user = missingPermissions(userPermissions!, command.userPermissions);

    if (user.length) {
      await ctx.reply({
        content: `You need the following permission${plural(user)} to run that command: **${user.join(', ')}**`
      });

      return false;
    }

    return true;
  }

  async checkCooldown(ctx: CommandContext, command: Command): Promise<boolean> {
    const { pass, remaining } = this.ratelimiter.check(ctx, command);
    if (pass) return true;

    const duration = getDuration(remaining);
    const content = random(cooldown[command.bucket])
      .replace(/{{user}}/g, ctx.displayName)
      .replace(/{{time}}/g, duration);

    await ctx.reply({ content, ephemeral: true });
    return false;
  }

  closestCommand(ctx: CommandContext, cmd: string) {
    const commands = this.client.commands.usableCommands(ctx.message);
    const aliases = commands.map(command => command.aliases).flat();
    const arr = [...commands.map(command => command.name), ...aliases];

    let minDistance = Infinity;
    let minIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      const dist = distance(cmd, arr[i]);
      if (dist < minDistance) {
        minDistance = dist;
        minIndex = i;
      }
    }

    if (minDistance > 2) return;

    const match = arr[minIndex];
    return ctx.reply(`|\`❔\`| Did you mean \`${match}\`?`);
  }
}

export default CommandHandler;
