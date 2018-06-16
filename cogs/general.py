import discord
from discord.ext import commands

class General:
    """Some general commands."""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    async def say(self, ctx, *, msg: commands.clean_content()):
        """Bot repeats what you say."""
        try:
            await ctx.message.delete()
        except discord.Forbidden:
            pass
        finally:
            await ctx.send(msg)

    @commands.command
    async def ping(self, ctx):
        """Checks if bot is working and measures websocket latency"""
        await ctx.send(f"Pong! WebSocket Latency: **{self.bot.latency * 1000:.4f} ms**")

    @commands.command()
    async def invite(self, ctx):
        """Want me in your server?"""
        await ctx.send(f"Invite me to your server: https://discordapp.com/oauth2/authorize?client_id={self.bot.user.id}&scope=bot&permissions=470281463")
    

def setup(bot):
    bot.add_cog(General(bot))