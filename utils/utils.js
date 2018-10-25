const { util: { toTitleCase } } = require("klasa");

class Util {
  constructor() {
    throw new Error("Static class");
  }

  static capitalize(str) {
    return str.split("_").map(toTitleCase).join(" ");
  }
  
  static embedContains(embed, str) {
    if(embed.title && embed.title.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.description && embed.description.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.footer && embed.footer.text && embed.footer.text.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.author && embed.author.name && embed.author.name.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.fields && embed.fields.length) {
      for(const field of embed.fields) {
        if(field.name && field.name.toLowerCase().includes(str.toLowerCase())) return true;
        if(field.value && field.value.toLowerCase().includes(str.toLowerCase())) return true;
      }
    }
    return false;
  }
  
  // https://j11y.io/snippets/wordwrap-for-javascript/
  /* static wordwrap(str, width = 75, brk = "n", cut = false) {
    if (!str) { return str; }
    if(str.length < width) return str;
    const regex = ".{1," + width + "}(\\s|$)" + (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");
    return str.match(RegExp(regex, "g")).join(brk);
  } */
  
  // I think this one is better?
  static wordwrap(str, maxLength) {
    if(str.length <= maxLength) return str;
    const reg = new RegExp(".{1," + maxLength + "}", "g");
    const parts = str.match(reg); 
    return parts.join("\n");
  }
  
  static slice(str, limit, suffix = "...") {
    if(str.length < limit) return str;
    if(suffix && suffix.length > limit) throw new Error("Suffix shouldn't be longer than limit.");
    if(!suffix) return str.slice(0, limit);
    return str.substring(0, limit - suffix.length) + suffix;
  }

  static random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  static clean(msg, content) {
    return content
      .replace(/@(everyone|here)/g, "@\u200b$1")
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, "");
        if (msg.channel.type === "dm" || msg.channel.type === "group") {
          return msg.client.users.has(id) ? `@${msg.client.users.get(id).username}` : input;
        }

        const member = msg.channel.guild.members.get(id);
        if (member) {
          if (member.nickname) return `@${member.nickname}`;
          return `@${member.user.username}`;
        } else {
          const user = msg.client.users.get(id);
          if (user) return `@${user.username}`;
          return input;
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = msg.client.channels.get(input.replace(/<|#|>/g, ""));
        if (channel) return `#${channel.name}`;
        return input;
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (msg.channel.type === "dm" || msg.channel.type === "group") return input;
        const role = msg.guild.roles.get(input.replace(/<|@|>|&/g, ""));
        if (role) return `@${role.name}`;
        return input;
      });
  }

  static mix(str, str2) {
    return str.slice(0, str.length / 2) + str2.slice(str2.length / 2);
  }

  static getAttachment(msg) {
    const attach = msg.attachments.filter((x) => x.url && x.width && x.height);
    if(attach.size) return attach.first().url;
    const imageEmbeds = msg.embeds.filter((x) => x.image && x.image.url);
    if(embeds.length) return embeds[0].image.url;
    const urlEmbeds = msg.embeds.filter((x) => x.type === "image" && x.url);
    if(urlEmbeds.length) return urlEmbeds[0].url;
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
