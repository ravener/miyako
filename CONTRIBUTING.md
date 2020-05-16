# Contributing to Miyako
Miyako is all open-source and is always open for contributions so feel free to send in pull requests anytime.

## Understanding the code.
This guide will guide you through the code and help better understand the structure of the code.

File structure
```lua
.
├── assets -- Assets for the bot.
│   └── json -- JSON assets.
├── commands -- All commands go here, inside a subdirectory for the category.
│   └── subdir -- Subdirectories for each command category.
├── events -- Event listeners.
├── extensions -- Extensions to discord.js structures.
├── monitors -- Message monitors.
├── structures -- Structures.
└── utils -- Utilities
```

## Creating events
```js
const Event = require("../structures/Event.js");

class MyEvent extends Event {
  constructor(...args) {
    super(...args, {
      name: "eventName"
      enabled: true
    })
  }

  async run(...args) {}
}
```
Unless you have to disable the event or do extra field initialization the constructor should be ommited.

Run takes arguments depending on the event. Event name is taken from filename if not given.

Events are reloadable.

## Commands.
TODO

## Comments
It is encouraged to add some comments and have some space between lines to keep the code readable, for example:

**Bad:**
```js
const id = doStuff();
if(!id) return ctx.reply("Not found.");
const role = ctx.guild.roles.cache.get(id);
await role.delete();
```
**Good:**
```js
// Try to find the role.
const id = doStuff();
if(!id) return ctx.reply("Not found.");

// Grab the role.
const role = ctx.guild.roles.cache.get(id);
// Delete it.
await role.delete();
```
The code should be clear and understandable by even beginners. No we won't document every single step to help people learn JavaScript and copy it but have some comments to explain the logic a little bit so it's easier to read and navigate the code.
