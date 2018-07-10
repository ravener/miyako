import discord
from discord.ext import commands


class Config:
    """Per server configuration commands."""
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    @commands.guild_only()
    @commands.has_permissions(manage_guild=True)
    async def prefix(self, ctx, *, prefix: str):
        """Changes the command prefix for your server"""
        if len(prefix) > 5:
            return await ctx.send("Prefix too long, please do not exceed 5 characters.")
        try:
            await self.bot.db.config.update_one({ "_id": ctx.guild.id }, { "$set": { "prefix": prefix } }, upsert=True)
            await ctx.send(f"Changed prefix to `{prefix}` successfully")
        except Exception as e:
            await ctx.send("Something went wrong please try again later.")
            raise e

    @commands.command(aliases=["setwelcome", "welcomemessages"])
    @commands.guild_only()
    @commands.has_permissions(manage_guild=True)
    async def welcome(self, ctx, action: str = "on"):
        """Turns on/off the welcome messages for this server"""
        action = action.lower()
        if action not in ["on", "off"]:
            return await ctx.send("Invalid choice, Usage: `welcome on/off`")
        if action == "off":
            await bot.db.config.update_one({ "_id": ctx.guild.id }, { "$set": { "welcome_channel": False, "welcome_message": None } }, upsert=True)
            return await ctx.send("Turned off welcome messages.")
        msg = await ctx.prompt("Mention the channel to send welcome messages in, make sure bot has the permissions to post in it.", raw=True, timeout=15, check=lambda x: x.author.id == ctx.author.id and x.channel.id == ctx.channel.id and len(x.channel_mentions) >= 1)
        if not msg:
            return
        channel = msg.channel_mentions[0]
        text = await ctx.prompt("Please send the welcome message to set, you can use some placeholders that will be replaced on send time, available placeholders:```\n{user} - mention the user.\n{guild} - The name of the server\n{name} - Name of user without mentioning\n{count} - Server member count.\n```", timeout=60)
        if not text:
            return
        await self.bot.db.config.update_one({ "_id": ctx.guild.id }, { "$set": { "welcome_channel": channel.id, "welcome_message": text } }, upsert=True)
        await ctx.send(f"Successfully set welcome message in channel <#{channel.id}>")

    @commands.command(aliases=["setleave", "leavemessages"])
    @commands.guild_only()
    @commands.has_permissions(manage_guild=True)
    async def leave(self, ctx, action: str = "on"):
        """Turns on/off the leave messages for this server"""
        action = action.lower()
        if action not in ["on", "off"]:
            return await ctx.send("Invalid choice, Usage: `leave on/off`")
        if action == "off":
            await bot.db.config.update_one({ "_id": ctx.guild.id }, { "$set": { "leave_channel": False, "leave_message": None } }, upsert=True)
            return await ctx.send("Turned off welcome messages.")
        msg = await ctx.prompt("Mention the channel to send leave messages in, make sure bot has the permissions to post in it.", raw=True, timeout=15, check=lambda x: x.author.id == ctx.author.id and x.channel.id == ctx.channel.id and len(x.channel_mentions) >= 1)
        if not msg:
            return
        channel = msg.channel_mentions[0]
        text = await ctx.prompt("Please send the leave message to set, you can use some placeholders that will be replaced on send time, available placeholders:```\n{guild} - The name of the server\n{name} - Name of user without mentioning\n{count} - Server member count.\n```", timeout=60)
        if not text:
            return
        await self.bot.db.config.update_one({ "_id": ctx.guild.id }, { "$set": { "leave_channel": channel.id, "leave_message": text } }, upsert=True)
        await ctx.send(f"Successfully set leave message in channel <#{channel.id}>")
        
    
def setup(bot):
    bot.add_cog(Config(bot))