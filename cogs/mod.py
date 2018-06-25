import discord
from discord.ext import commands

class Mod:
    """Useful moderation commands to keep the server under control."""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    @commands.guild_only()
    @commands.has_permissions(kick_members=True)
    async def kick(self, ctx, user: discord.Member, *, reason: str = None):
        """Kicks a user from the server."""
        if user == ctx.author:
            return await ctx.send("Kicking yourself? smh.")
        if user == self.bot.user:
            return await ctx.send("I can't kick myself.")
        res = f", for reason: `{reason}`" if reason else ""
        try:
            await user.kick(reason=reason)
            await ctx.send(f"Kicked {user}{res}")
        except discord.Forbidden:
            await ctx.send("I don't have permissions to kick that user.")
        except Exception as e:
            raise e

    @commands.command()
    @comnands.guild_only()
    @commands.has_permissions(manage_messages=True)
    async def purge(self, ctx, amount):
        """Purges X amount of messages from a channel"""
        try:
            amount = int(amount)
        except ValueError:
            return await ctx.send("Enter a number only!")
        try:
            await ctx.channel.purge(limit=amount+1)
            await ctx.send(f"Purged **{amount}** messages", delete_after=3)
        except discord.Forbidden:
            await ctx.send(f"I need the `Manage Messages` permission to do this.")

def setup(bot):
    bot.add_cog(Mod(bot))