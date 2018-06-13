import discord
from discord.ext import commands

class Mod:
    """Useful moderation commands to keep the server under control."""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    @commands.guild_only()
    @commands.has_permissions(kick_members=True)
    async def kick(self, ctx, user: discord.Member = None, *, reason: str = None):
        """Kicks a user from the server."""
        if not user:
            return await ctx.send("Mention a user to kick!")
        if user == ctx.author:
            return await ctx.send("Kicking yourself? smh.")
        if user == self.bot.user:
            return await ctx.send("I can't kick myself.")
        res = f", for reason: `{reason}`" if reason else ""
        try:
            await user.kick(reason)
            await ctx.send(f"Kicked {user}{res}")
        except discord.Forbidden:
            await ctx.send("I don't have permissions to kick that user.")
        except Exception as e:
            raise e

def setup(bot):
    bot.add_cog(Mod(bot))