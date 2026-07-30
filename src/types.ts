import type {
  User,
  GuildMember,
  Role,
  GuildBasedChannel,
  PermissionResolvable,
  SlashCommandBuilder
} from 'discord.js';
import type { request } from 'undici';
import type MiyakoClient from './structures/MiyakoClient.js';
import type CommandStore from './structures/CommandStore.js';

export type RequestOptions = Parameters<typeof request>[1];

export interface PieceLocation {
  path: string;
  name: string;
  dir: string;
}

export type CommandConstructorArgs = [client: MiyakoClient, store: CommandStore, file: PieceLocation];

export interface BaseData {
  name?: string;
  enabled?: boolean;
}

export type CommandMode = 'slash' | 'text';
export type CommandBucket = 'user' | 'guild' | 'channel' | 'global';

export interface CommandOption {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  choices?: { name: string; value: string | number }[];
}

export type CommandOptionsData = CommandOption[] | ((builder: SlashCommandBuilder) => void);

export interface CommandData extends BaseData {
  description?: string;
  extendedHelp?: string;
  modes?: CommandMode[];
  ownerOnly?: boolean;
  aliases?: string[];
  cooldown?: number;
  bucket?: CommandBucket;
  cost?: number;
  nsfw?: boolean;
  category?: string;
  guildOnly?: boolean;
  hidden?: boolean;
  usage?: string;
  loading?: boolean;
  options?: CommandOptionsData;
  delim?: string;
  botPermissions?: PermissionResolvable;
  userPermissions?: PermissionResolvable;
}

// The message language accessor referenced by the argument verifiers.
export interface LocalizedMessage {
  language: { get(key: string): string };
}

export interface RedditPost {
  title: string;
  url: string;
  ups: number;
  downs: number;
  over_18: boolean;
}

export interface RedditListing {
  data: { children: { data: RedditPost }[] };
  error?: unknown;
}

export interface RedditSubreddit {
  title: string;
  public_description: string;
  subscribers: number;
  accounts_active: number;
  over18: boolean;
  icon_img?: string;
  banner_img?: string;
}

// Unifies discord.js' option resolver with the text-mode CommandOptions wrapper.
export interface OptionResolver {
  getUser(name: string): User;
  getMember(name: string): GuildMember;
  getRole(name: string): Role;
  getChannel(name: string): GuildBasedChannel;
  getString(name: string): string;
  getInteger(name: string): number;
}
