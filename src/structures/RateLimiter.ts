import type CommandContext from './CommandContext.js';
import type Command from './Command.js';

interface RateLimitResult {
  pass: boolean;
  remaining: number;
}

class RateLimiter {
  buckets: Map<string, Record<string, number>>;

  constructor() {
    this.buckets = new Map();
  }

  getBucket(ctx: CommandContext, command: Command): string {
    switch (command.bucket) {
      case 'user': return ctx.author.id;
      case 'guild': return ctx.guild?.id ?? 'global';
      case 'channel': return ctx.channel.id;
      case 'global': return 'global';
      default: throw new TypeError(`Invalid bucket '${command.bucket}'`);
    }
  }

  setTimeout(command: Command, bucket: string, cooldown: number) {
    return setTimeout(() => {
      const ratelimits = this.buckets.get(bucket);
      if (!ratelimits) return;
      delete ratelimits[command.name];

      if (bucket !== 'global' && Object.keys(ratelimits).length === 0) {
        this.buckets.delete(bucket);
      }
    }, cooldown);
  }

  check(ctx: CommandContext, command: Command): RateLimitResult {
    if (!command.cooldown) return { pass: true, remaining: 0 };
    if (ctx.owner) return { pass: true, remaining: 0 };

    const cooldown = command.cooldown * 1000;
    const bucket = this.getBucket(ctx, command);
    const ratelimits: Record<string, number> = this.buckets.get(bucket) ?? {};

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
