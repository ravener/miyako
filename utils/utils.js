
class Util {
  constructor() {
    throw new Error("Static class");
  }
  
  static slice(str, limit, suffix = "...") {
    if(str.length < limit) return str;
    if(suffix && suffix.length > limit) throw new Error("Suffix shouldn't be longer than limit.");
    if(!suffix) return str.slice(0, limit);
    return str.substring(0, limit - suffix.length) + suffix;
  }

  static dir(obj = {}) {
    const x = Object.getOwnPropertyNames(obj);
    const p = Object.getOwnPropertyNames(obj.prototype || {});
    const c = Object.getOwnPropertyNames(obj.constructor ? obj.constructor.prototype : {});
    return Array.from(new Set([ ...x, ...p, ...c ]));
  }

  static random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static mix(str, str2) {
    return str.slice(0, str.length / 2) + str2.slice(str2.length / 2);
  }

  static getAttachment(msg) {
    const attach = msg.attachments.filter((x) => x.url && x.width && x.height);
    if(attach.size) return attach.first().url;
    const embeds = msg.embeds.filter((x) => x.image && x.image.url);
    if(embeds.length) return embeds[0].image.url;
    return null;
  }

  static* range(start, stop, incr = 1) {
    if(!stop) {
      stop = start;
      start = 0;
    }

    for(; start < stop; start += incr) {
      yield start;
    }
  }
}

module.exports = Util;
