const { promisify } = require("node:util");
const suffixes = ["Bytes", "KB", "MB", "GB"];
const { promises: { lstat, readdir } } = require("node:fs");
const path = require("node:path");

/**
 * Static class with utilities used throughout the bot.
 */
class Utils {
  constructor() {
    throw new Error("Utils is a static class and cannot be instantiated.");
  }

  static missingPermissions(permissions, target) {
    return permissions.missing(target)
      .map(perms => perms.replace(/([a-z])([A-Z])/g, "$1 $2"));
  }
  
  static toProperCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  static random(arr) {
    return arr[~~(Math.random() * arr.length)];
  }

  static plural(arrayOrLength) {
    if (Array.isArray(arrayOrLength)) {
      return arrayOrLength.length > 1 ? "s" : "";
    }

    return arrayOrLength > 1 ? "s" : "";
  }
  
  static getBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (!bytes && "0 Bytes") || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
  }

  static escapeRegex(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  // Convert milliseconds into human readable string.
  static getDuration(time) {
    const seconds = Math.floor(time / 1000) % 60 ;
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor((time / (1000 * 60 * 60 * 24)) % 7);

    return [
      `${days} day${days > 1 ? "s" : ""}`,
      `${hours} hour${hours > 1 ? "s" : ""}`,
      `${minutes} minute${minutes > 1 ? "s" : ""}`,
      `${seconds} second${seconds > 1 ? "s" : ""}`
    ].filter(time => !time.startsWith("0")).join(", ");
  }

  // Tries to find an image from a message.
  static getImage(msg) {
    // First see if we have an attachment.
    const attach = msg.attachments.filter(attach => attach.url && attach.width && attach.height);
    if (attach.size) return attach.first().url;

    // Next see if we have an embed with an image.
    const imageEmbeds = msg.embeds.filter(embed => embed.image && embed.image.url);
    if (imageEmbeds.length) return imageEmbeds[0].image.url;

    // Finally see if there is an image url.
    const urlEmbeds = msg.embeds.filter(embed => embed.type === "image" && embed.url);
    if (urlEmbeds.length) return urlEmbeds[0].url;

    // Found nothing.
    return null;
  }

  static getCodeBlock(txt) {
    const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
    if (!match) return { lang: null, code: txt };
    if (match[1] && !match[2]) return { lang: null, code: match[1] };
    return { lang: match[1], code: match[2] };
  }

  static async walk(dir, options = {}, results = new Map(), level = -1) {
    dir = path.resolve(dir);
    const stats = await lstat(dir);

    if (!options.filter || options.filter(stats, dir)) {
      results.set(dir, stats);
    }

    if (stats.isDirectory() && (typeof options.depthLimit === "undefined" || level < options.depthLimit)) {
      await Promise.all((await readdir(dir)).map((part) => Utils.walk(path.join(dir, part), options, results, ++level)));
    }

    return results;
  }

  static link(name, url) {
    return `[${name}](${url})`;
  }
}

Utils.sleep = promisify(setTimeout);
module.exports = Utils;
