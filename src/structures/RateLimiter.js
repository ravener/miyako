
class RateLimiter {
  constructor() {
    this.buckets = new Map();
  }

  getBucket(ctx, command) {
    switch (command.bucket) {
      case 'user': return ctx.author.id;
      case 'guild': return ctx.guild?.id ?? 'global';
      case 'channel': return ctx.channel.id;
      case 'global': return 'global';
      default: throw new TypeError(`Invalid bucket '${command.bucket}'`);
    }
  }

  setTimeout(command, bucket, cooldown) {
    return setTimeout(() => {
      const ratelimits = this.buckets.get(bucket);
      if (!ratelimits) return;
      delete ratelimits[command.name];

      if (bucket !== 'global' && Object.keys(ratelimits).length === 0) {
        this.buckets.delete(bucket);
      }
    }, cooldown);
  }

  check(ctx, command) {
    if (!command.cooldown) return { pass: true, remaining: 0 };
    if (ctx.owner) return { pass: true, remaining: 0 };

    const cooldown = command.cooldown * 1000;
    const bucket = this.getBucket(ctx, command);
    const ratelimits = this.buckets.get(bucket) ?? {};

    if (!ratelimits[command.name]) {
      ratelimits[command.name] = Date.now() - cooldown;
    }

    const difference = Date.now() - ratelimits[command.name];
    if (difference < cooldown) {
      return {
        pass: false,
        remaining: Math.round(cooldown - difference)
      };
    } else {
      ratelimits[command.name] = Date.now();
      this.buckets.set(bucket, ratelimits);
      this.setTimeout(command, bucket, cooldown);

      return { pass: true, remaining: 0 };
    }
  }
}

export default RateLimiter;
