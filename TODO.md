# TODO
This is a list of a personal TODO for stuff that needs to be done. Feel free to contribute.

## Database
~~I'm more satisfied than before with the database management system I've implemented but could still be better. Mimic [klasa](https://github.com/dirigeants/klasa)'s settings gateway a little bit more in terms of efficiency while keeping it suitable for Miyako alone and keeping the syntax convenient. The database system is very important to scale in the long term and should be future proof for sharding so some serious work should be done on it.~~

Edit: thinking again I'm more satisfied with the current structure. I will consider this done for now.

## Monitors
I currently hacked a temporary workaround for the points monitor until we needed more monitors. All we need to implement them is here, it's easy to extend and add more stores so add a new monitors store

## Commands
~~Commands should get an `nsfw` property for the future.~~ Done.

~~Like [Misaki](https://github.com/NotAWeebDev/Misaki) make some type of `Social` class which is an extended command for more helpful utilities for social commands. (maybe)~~ Not needed anymore.

~~Add reactions, nsfw and more from [nekos.life](https://nekos.life) API, maybe write some code to reduce duplications as a lot of this commands are gonna be similar as in they just do a quick HTTP request and embed the response.~~ Done. I didn't bother reducing duplicate, just copy-pasted around.

And last but not least port over more commands from [LadyBug-Bot](https://github.com/pollen5/ladybug-archive) which was the older version of this bot which used Klasa, I'm actively porting most commands from there but sometimes i hold off some that needs special support in the code structure.

## Git
~~Actually start using proper commit messages :P~~

I just can't

## Console
I made `MiyakoClient#console` an alias to the Node.js `console` temporarily, but it's there to add a better logger in there.

## Sharding
Not a problem for now but do a little research.

But we do need to make sure our code is future proof for sharding.

I'm wondering about settings cache and stuff becoming outdated in seperate shards.

It actually might be safe already, I force a synchronize when writing to other user's settings and the author's settings are already synchronized although a light sync where it's only pulled from DB if it's not in cache. What if it is in cache but might have been affected by a different shard so we would read old data? Members cannot be affected by a different shard because it is only related to one guild. But users are global. Maybe we should force sync users always? What is the point of cache then.

Guilds are fully safe, their settings cannot overlap or get modified from other shards and it makes 100% sense to cache those.

I've seen people that cached guild settings but used something like Redis for member settings and such. And there are also people who always directly reads from DB. The purpose of cache in our case is to reduce reads because point system keeps adding points a lot, it would be a waste to read and then write afterwards when we can keep track of the changes ourselves.

Final conclusion I think is the right way is to:
- Do not cache users. Force sync their settings always. As users are global and their settings can be changed from a different shard.
- Cache members. Their settings cannot overlap with other shards.
- Cache guilds. Their settings cannot overlap with other shards.

It seems we only have to worry about number 1 which is an easy fix.

That's with a multi-process sharding if we shard everything in a single process everything will behave correctly as is right now but that might be extra load and defeats the purpose of sharding.

As I said we don't need to worry about it yet, I'm sitting in around 330 guilds right now and sharding only matters at 2,500 guilds.

I think we'll be fine but I'm kinda overthinking this. Discussions about this are welcome [in my server](https://discord.gg/mDkMbEh)
