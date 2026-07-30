import { lstat, readdir } from 'node:fs/promises';
import type { Stats } from 'node:fs';
import path from 'node:path';
import type { Message, PermissionResolvable, PermissionsBitField } from 'discord.js';

const suffixes = ['Bytes', 'KB', 'MB', 'GB'];

interface WalkOptions {
  filter?: (stats: Stats, file: string) => boolean;
  depthLimit?: number;
}

export function missingPermissions(permissions: Readonly<PermissionsBitField>, target: PermissionResolvable): string[] {
  return permissions.missing(target)
    .map(perms => perms.replace(/([a-z])([A-Z])/g, '$1 $2'));
}

export function toProperCase(str: string): string {
  return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function random<T>(arr: T[]): T {
  return arr[~~(Math.random() * arr.length)];
}

export function plural(arrayOrLength: unknown[] | number): string {
  if (Array.isArray(arrayOrLength)) {
    return arrayOrLength.length > 1 ? 's' : '';
  }

  return arrayOrLength > 1 ? 's' : '';
}

export function getBytes(bytes: number): string {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (!bytes && '0 Bytes') || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
}

export function escapeRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Convert milliseconds into human readable duration string.
 */
export function getDuration(time: number): string {
  if (time < 1000) return `${time} ms`;

  const seconds = Math.floor(time / 1000) % 60 ;
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const days = Math.floor((time / (1000 * 60 * 60 * 24)) % 7);

  return [
    `${days} day${days > 1 ? 's' : ''}`,
    `${hours} hour${hours > 1 ? 's' : ''}`,
    `${minutes} minute${minutes > 1 ? 's' : ''}`,
    `${seconds} second${seconds > 1 ? 's' : ''}`
  ].filter(time => !time.startsWith('0')).join(', ');
}

/**
 * Tries to find an image from a message.
 */
export function getImage(msg: Message): string | null {
  // First see if we have an attachment.
  const attach = msg.attachments.filter(attach => Boolean(attach.url && attach.width && attach.height));
  if (attach.size) return attach.first()!.url;

  // Next see if we have an embed with an image.
  const imageEmbeds = msg.embeds.filter(embed => Boolean(embed.image && embed.image.url));
  if (imageEmbeds.length) return imageEmbeds[0].image!.url;

  // Finally see if there is an image url.
  const urlEmbeds = msg.embeds.filter(embed => (embed as { type?: string }).type === 'image' && embed.url);
  if (urlEmbeds.length) return urlEmbeds[0].url;

  // Found nothing.
  return null;
}

export function getCodeBlock(txt: string): { lang: string | null; code: string } {
  const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
  if (!match) return { lang: null, code: txt };
  if (match[1] && !match[2]) return { lang: null, code: match[1] };
  return { lang: match[1], code: match[2] };
}

export async function walk(dir: string, options: WalkOptions = {}, results = new Map<string, Stats>(), level = -1): Promise<Map<string, Stats>> {
  dir = path.resolve(dir);
  const stats = await lstat(dir);

  if (!options.filter || options.filter(stats, dir)) {
    results.set(dir, stats);
  }

  if (stats.isDirectory() && (typeof options.depthLimit === 'undefined' || level < options.depthLimit)) {
    await Promise.all((await readdir(dir)).map((part) => walk(path.join(dir, part), options, results, ++level)));
  }

  return results;
}

export function link(name: string, url: string): string {
  return `[${name}](${url})`;
}
