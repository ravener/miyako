const { promisify } = require("util");

const suffixes = ["Bytes", "KB", "MB", "GB"];

/**
 * Static class with utilities used throughout the bot.
 */
class Utils {
  constructor() {
    throw new Error("Utils is a static class and cannot be instantiated.");
  }
  
  static toProperCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  static random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  static getBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (!bytes && "0 Bytes") || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
  }

  static escapeRegex(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  static getDuration(time) {
    const seconds = Math.floor(time / 1000) % 60 ;
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor((time / (1000 * 60 * 60 * 24)) % 7);
    return [`${days} Days`, `${hours} Hours`, `${minutes} Minutes`,
      `${seconds} Seconds`].filter((time) => !time.startsWith("0")).join(", ");
  }
}

Utils.sleep = promisify(setTimeout);

module.exports = Utils;
