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

def setup(bot):
    bot.add_cog(General(bot))