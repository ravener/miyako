# TODO
This is a list of a personal TODO for stuff that needs to be done. Feel free to contribute.

## Database
I'm more satisfied than before with the database management system I've implemented but could still be better. Mimic [klasa](https://github.com/dirigeants/klasa)'s settings gateway a little bit more in terms of efficiency while keeping it suitable for Miyako alone and keeping the syntax convenient. The database system is very important to scale in the long term and should be future proof for sharding so some serious work should be done on it.

Edit: thinking again I'm more satisfied with the current structure, i will consider this done for now.

## Monitors
I currently hacked a temporary workaround for the points monitor until we needed more monitors. All we need to implement them is here, it's easy to extend and add more stores so add a new monitors store.

## Commands
Commands should get an `nsfw` property for the future.

Like [Misaki](https://github.com/NotAWeebDev/Misaki) make some type of `Social` class which is an extended command for more helpful utilities for social commands. (maybe)

Add reactions, nsfw and more from [nekos.life](https://nekos.life) API, maybe write some code to reduce duplications as a lot of this commands are gonna be similar as in they just do a quick HTTP request and embed the response.

And last but not least port over more commands from [LadyBug-Bot](https://github.com/pollen5/ladybug-archive) which was the older version of this bot which used Klasa, I'm actively porting most commands from there but sometimes i hold off some that needs special support in the code structure.

## Git
Actually start using proper commit messages :P
