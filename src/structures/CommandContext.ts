import { TYPING, OWNER_ID } from '../utils/constants.js';
import type {
  Message,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  InteractionEditReplyOptions,
  MessageReplyOptions,
  MessageEditOptions,
  InteractionResponse,
  Guild,
  User,
  GuildMember,
  TextBasedChannel,
  TextChannel
} from 'discord.js';
import type Command from './Command.js';
import type MiyakoClient from './MiyakoClient.js';
import type { OptionResolver } from '../types.js';

type ReplyOptions = string | (InteractionReplyOptions & { fetchReply?: boolean });

interface ContextData {
  message?: Message;
  interaction?: ChatInputCommandInteraction;
  prefixLength?: number;
  flags?: Record<string, string>;
  alias?: string;
  content?: string;
  args?: string[];
}

class CommandContext {
  command?: Command;
  message: Message;
  interaction: ChatInputCommandInteraction;
  lastReply: Message | null;
  content!: string;
  prefixLength!: number;
  flags!: Record<string, string>;
  alias!: string;
  args!: string[];
  options!: OptionResolver;

  constructor(command: Command | undefined, { message, interaction, prefixLength, flags, alias, content, args }: ContextData) {
    this.command = command;
    this.message = message as Message;
    this.interaction = interaction as ChatInputCommandInteraction;
    this.lastReply = null;

    if (message && command) {
      this.content = content!;
      this.prefixLength = prefixLength!;
      this.flags = flags!;
      this.alias = alias!;
      this.args = args!.join(' ').split(command.delim);
    }
  }

  get rawArgs() {
    return this.content.slice(this.alias.length).trim();
  }

  get client(): MiyakoClient {
    return (this.interaction?.client ?? this.message.client) as MiyakoClient;
  }

  get mode() {
    return this.interaction ? 'slash' : 'text';
  }

  get slash() {
    return !!this.interaction;
  }

  get text() {
    return !!this.message;
  }

  get guild(): Guild | null {
    return this.interaction?.guild ?? this.message.guild;
  }

  get author(): User {
    return this.interaction?.user ?? this.message.author;
  }

  get member(): GuildMember | null {
    return (this.interaction?.member ?? this.message.member) as GuildMember | null;
  }

  get me() {
    return this.guild?.members.me;
  }

  get channel(): TextBasedChannel {
    return (this.interaction?.channel ?? this.message.channel) as TextBasedChannel;
  }

  get createdTimestamp() {
    return this[this.slash ? 'interaction' : 'message'].createdTimestamp;
  }

  get owner() {
    return this.author.id === OWNER_ID;
  }

  get nsfw() {
    return this.guild ? (this.channel as TextChannel).nsfw : true;
  }

  get displayName() {
    return this.member?.displayName ?? this.author.username;
  }

  async reply(options: ReplyOptions): Promise<Message | InteractionResponse> {
    if (this.slash) return this.interaction.reply(options);
    if (this.message.lastReply) return this.message.lastReply.edit(options as string | MessageEditOptions);
    this.message.lastReply = await this.message.reply(options as string | MessageReplyOptions);
    return this.message.lastReply;
  }

  async editReply(options: ReplyOptions): Promise<Message | InteractionResponse> {
    if (this.slash) return this.interaction.editReply(options as string | InteractionEditReplyOptions);
    if (this.message.lastReply) return this.message.lastReply.edit(options as string | MessageEditOptions);
    return this.reply(options);
  }

  deferReply({ ephemeral }: { ephemeral?: boolean } = {}) {
    if (this.slash) return this.interaction.deferReply({ ephemeral });

    const { username } = this.client.user!;
    return this.reply({
      content: `${TYPING} **${username}** is thinking...`
    });
  }
}

export default CommandContext;
