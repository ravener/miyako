
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
  
  static random(arr) {
    if(!(arr instanceof Array)) throw new Error("Expected an array as argument.");
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static getAttachment(msg) {
    const attach = msg.attachments.filter((x) => x.url && x.width && x.height);
    if(attach.size) return attach.first().url;
    const embeds = msg.embeds.filter((x) => x.image && x.image.url);
    if(embeds.length) return embeds[0];
    return null;
  }
}

module.exports = Util;
