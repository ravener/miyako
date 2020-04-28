# Database Concept
Current way database is managed is very ugly and I question myself about it everyday.

The main issues are:
- No cache (Lot of database requests everywhere)
- SQL Queries all around. Less abstraction over the database provider, will make it extremely difficult to migrate to another database if we ever have to.
- Ugly usage. Believe me it just looks terrible doing `this.client.db.query`/`if(!rows.length)`/`rows[0].prefix`

## The Solution
We need to cache the settings for every guild to reduce database calls and write an abstraction over the database that will also take care of updating the cache.

Preferably a `Map` caching all settings and each guilds get a `.settings` property with an object of the cached settings it contains.

We will write a function that builds a SQL query and also updates the cache `this.client.settings.set` (or maybe `guild.settings.update`) or similar? i think making `.settings` a pure object is better however. Just need a way to update settings while keeping the cache in sync.

The usage could be something like `update({ name: "something" })` and it would build up the query `UPDATE FROM table SET name = 'something'` and also takes care to loop through cache and keep the keys updated.

Initially my idea was to use queries all around because it's fun, the only thing I liked about SQL was the well the queries. But now I see why that is a bad idea and why some would prefer to use ORMs etc. I had thoughts of using MongoDB etc too but I think the database is no longer the issue, it is the way I'm thinking about it. I mean having a schema and all is useful, I can be sure an invalid input can never get in my database. I ended up with the idea that abstracting the database away is the best choice, having a cache is very useful.

I came from [klasa](https://github.com/dirigeants/klasa) which abstracted the database usage very well and had cache, i'd like something similar.

At startup the bot would query the database and load all records into cache and then we use methods that will keep the cache in sync.

This way we will only call database at startup and when writing settings, never on fetching data as we will always have them in our cache.

I'm not sure if `guild.settings` should be a reference object or a getter to calling `this.client.settings.get()` everytime.

The former might be faster but we have to make sure we don't lose the reference. The latter is more safe, I don't think the performance is a problem at all. I'll start coding and see for myself which situation will work better.
