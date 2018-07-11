import discord
from discord.ext import commands
from utils.utils import *
from ext.context import Context
import os
import inspect
import io
from contextlib import redirect_stdout
import textwrap
import traceback
import aiohttp
import re
from motor.motor_asyncio import AsyncIOMotorClient
import datetime

async def getprefix(bot, message):
    if isinstance(message.channel, discord.DMChannel):
        return commands.when_mentioned_or("lb.")(bot, message)
    try:
        guild = await bot.db.config.find_one({ "_id": message.guild.id })
        if not guild:
            return commands.when_mentioned_or("lb.")(bot, message)
        prefix = guild.get("prefix", "lb.")
        return commands.when_mentioned_or(prefix)(bot, message)
    except:
        return commands.when_mentioned_or("lb.")(bot, message)

bot = commands.Bot(command_prefix=getprefix, description="A simple Miraculous discord bot.", owner_id=292690616285134850)
bot._last_result = None
bot.session = aiohttp.ClientSession(loop=bot.loop)
bot.start_time = datetime.datetime.utcnow()
bot.commands_ran = 0
bot.cogs_list = sorted([ "cogs." + x.replace(".py", "") for x in os.listdir("cogs") if x.endswith(".py") ])
bot.db = AsyncIOMotorClient(os.environ.get("MONGODB")).ladybug
bot.remove_command("help")


@bot.event
async def on_message(message):
    if message.author.bot:
        return

    ctx = await bot.get_context(message, cls=Context)
    if not ctx.command:
        return
    await bot.invoke(ctx)


@bot.event
async def on_ready():
    print("Bot is online!")
    print(f"Logged in as {bot.user.name}#{bot.user.discriminator} ({bot.user.id})")
    print(f"Servers: {len(bot.guilds)}")
    print(f"Users: {len(bot.users)}")
    print(f"Channels: {channel_count(bot)}")
    print(f"WebSocket Ping: {bot.latency:.4f} ms")
    await bot.change_presence(activity=discord.Game(f"lb.help | {len(bot.guilds)} servers!"))
    print("Loading cogs...")
    for x in bot.cogs_list:
        try:
            bot.load_extension(x)
        except Exception as e:
            print(f"LoadError in {x}:\n{e}")


@bot.event
async def on_raw_reaction_add(payload):
    if payload.user_id == bot.user.id:
        return
    channel = bot.get_channel(payload.channel_id)
    if not channel:
        return
    if channel.id != 460800229667504148:
        return
    emoji = payload.emoji
    if emoji.is_custom_emoji():
        emoji = emoji.id
    if emoji != 466669201025925120:
        return
    msg = await channel.get_message(payload.message_id)
    if not msg:
        return
    user = bot.get_user(int(msg.embeds[0].footer.text))
    if not user:
        return
    try:
        me = bot.get_user(292690616285134850)
        em = discord.Embed(color=0xff0000)
        em.set_author(name=str(me), icon_url=me.avatar_url)
        em.title = "Invalid Report"
        em.description = f"Your bug report ```\n{msg.embeds[0].description}\n```has been marked invalid, please be more specific next time."
        await user.send(embed=em)
    except:
        pass
    await msg.delete()
    
   

@bot.event
async def on_member_join(member):
    welcome = await bot.db.config.find_one({ "_id": member.guild.id })
    if not welcome:
        return
    channel_id = welcome.get("welcome_channel", None)
    message = welcome.get("welcome_message", None)
    if not channel_id or not message:
        return
    channel = bot.get_channel(channel_id)
    if not channel:
        return
    try:
        await channel.send(message.replace("{user}", member.mention).replace("{guild}", member.guild.name).replace("{name}", member.name).replace("{count}", str(member.guild.member_count)))
    except Exception as e:
        print(e)


@bot.event
async def on_member_remove(member):
    leave = await bot.db.config.find_one({ "_id": member.guild.id })
    if not leave:
        return
    channel_id = leave.get("leave_channel", None)
    message = leave.get("leave_message", None)
    if not channel_id or not message:
        return
    channel = bot.get_channel(channel_id)
    if not channel:
        return
    try:
        await channel.send(message.replace("{guild}", member.guild.name).replace("{name}", member.name).replace("{count}", str(member.guild.member_count)))
    except Exception as e:
        print(e)


@bot.event
async def on_guild_join(guild):
    em = discord.Embed()
    em.color = 0x00ff00
    em.title = "Ladybug joined a new server!"
    em.description = guild.name
    if guild.icon_url:
        em.set_thumbnail(url=guild.icon_url)
    em.add_field(name="Owner", value=f"{guild.owner}")
    em.add_field(name="Member Count", value=f"{guild.member_count}")
    em.set_footer(text=f"{guild.id}")
    channel = bot.get_channel(454776806869041154)
    await channel.send(embed=em)
    await bot.change_presence(activity=discord.Game(f"lb.help | {len(bot.guilds)} servers!"))


@bot.event
async def on_guild_remove(guild):
    em = discord.Embed()
    em.color = 0xff0000
    em.title = "Ladybug left a server."
    em.description = guild.name
    if guild.icon_url:
        em.set_thumbnail(url=guild.icon_url)
    em.add_field(name="Owner", value=f"{guild.owner}")
    em.add_field(name="Member Count", value=f"{guild.member_count}")
    em.set_footer(text=f"{guild.id}")
    channel = bot.get_channel(454776806869041154)
    await channel.send(embed=em)
    await bot.change_presence(activity=discord.Game(f"lb.help | {len(bot.guilds)} servers!"))
    try:
        await bot.db.config.delete_one({ "_id": guild.id })
    except Exception as e:
        print(e)


@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.NotOwner):
        return await ctx.send("This command is for owner only!")
    if isinstance(error, commands.MissingPermissions):
        if ctx.author.id == 292690616285134850:
            return await ctx.reinvoke()
        perms = list(map(capitalize, error.missing_perms))
        return await ctx.send("Your missing permission(s) to run this command:\n{}".format("\n".join(perms)))
    if isinstance(error, commands.CommandNotFound):
        return
    if isinstance(error, commands.CommandOnCooldown):
    
        if ctx.author.id == 292690616285134850:
            return await ctx.reinvoke()
        hours, remainder = divmod(int(error.retry_after), 3600)
        minutes, seconds = divmod(remainder, 60)
        days, hours = divmod(hours, 24)
        fmt = "{s} seconds"
        if minutes:
            fmt = "{m}m {s}s"
        if hours:
            fmt = "{h}h {m}m {s}s"
        if days:
            fmt = "{d}d {h}h {m}m {s}s"
        cooldown = fmt.format(d=days, h=hours, m=minutes, s=seconds)
        return await ctx.send(f"Please wait **{cooldown}** before using this command again.")
    if isinstance(error, commands.NoPrivateMessage):
        return await ctx.send("This command can only be ran in a server!")
    if isinstance(error, commands.BadArgument):
        return await ctx.send(error)
    if isinstance(error, commands.MissingRequiredArgument):
        return await ctx.send(error)
    if isinstance(error, commands.DisabledCommand):
        if ctx.author.id == 292690616285134850:
            return await ctx.reinvoke()
        return await ctx.send("Sorry, this command is currently disabled.")
        
    await ctx.send("Something went wrong, please try again later.")

    em = discord.Embed()
    em.color = 0xff0000
    em.title = "CommandError"
    em.description = f"An Error occured in command: {ctx.command}\n```py\n{error}\n```"
    em.set_footer(text=f"User: {ctx.author}, Guild: {ctx.guild}")
    logs = bot.get_channel(454776836929617921)
    await logs.send(embed=em)


@bot.event
async def on_command(ctx):
    bot.commands_ran += 1

if __name__ == "__main__":
    bot.run(os.environ.get("TOKEN"))