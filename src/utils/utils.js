import { lstat, readdir } from 'node:fs/promises';
import path from 'node:path';

const suffixes = ['Bytes', 'KB', 'MB', 'GB'];

export function missingPermissions(permissions, target) {
  return permissions.missing(target)
    .map(perms => perms.replace(/([a-z])([A-Z])/g, '$1 $2'));
}

export function toProperCase(str) {
  return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function random(arr) {
  return arr[~~(Math.random() * arr.length)];
}

export function plural(arrayOrLength) {
  if (Array.isArray(arrayOrLength)) {
    return arrayOrLength.length > 1 ? 's' : '';
  }

  return arrayOrLength > 1 ? 's' : '';
}

export function getBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (!bytes && '0 Bytes') || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
}

export function escapeRegex(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Convert milliseconds into human readable duration string.
 */
export function getDuration(time) {
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
export function getImage(msg) {
  // First see if we have an attachment.
  const attach = msg.attachments.filter(attach => attach.url && attach.width && attach.height);
  if (attach.size) return attach.first().url;

  // Next see if we have an embed with an image.
  const imageEmbeds = msg.embeds.filter(embed => embed.image && embed.image.url);
  if (imageEmbeds.length) return imageEmbeds[0].image.url;

  // Finally see if there is an image url.
  const urlEmbeds = msg.embeds.filter(embed => embed.type === 'image' && embed.url);
  if (urlEmbeds.length) return urlEmbeds[0].url;

  // Found nothing.
  return null;
}

export function getCodeBlock(txt) {
  const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
  if (!match) return { lang: null, code: txt };
  if (match[1] && !match[2]) return { lang: null, code: match[1] };
  return { lang: match[1], code: match[2] };
}

export async function walk(dir, options = {}, results = new Map(), level = -1) {
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

export function link(name, url) {
  return `[${name}](${url})`;
}