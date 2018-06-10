import discord
from discord.ext import commands
import idioticapi
import os

class Canvas:
    def __init__(self, bot):
        self.bot = bot
        self.client = idioticapi.Client(os.environ.get("IDIOTICAPI"), dev=True)
        
    @commands.command()
    async def triggered(self, ctx, user: discord.Member = None):
        try:
            await ctx.send(file=discord.File(await self.client.triggered(user.avatar_url_as(format="png", size=2048)), "triggered.gif"))
        except Exception as e:
            await ctx.send("Something went wrong, please try again later.")
            print(e)
            
def setup(bot):
    bot.add_cog(Canvas(bot))