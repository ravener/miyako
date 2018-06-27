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
        try:
            await self.bot.db.prefix.update_one({ "_id": ctx.guild.id }, { "$set": { "prefix": prefix } }, upsert=True)
            await ctx.send(f"Changed prefix to `{prefix}` successfully")
        except Exception as e:
            await ctx.send("Something went wrong please try again later.")
            raise e


def setup(bot):
    bot.add_cog(Config(bot))