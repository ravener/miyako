import discord
from discord.ext import commands
import idioticapi
import os

class Canvas:
    """Some fun image commands"""
    def __init__(self, bot):
        self.bot = bot
        self.client = idioticapi.Client(os.environ.get("IDIOTICAPI"), dev=True, session=self.bot.session)

    def av(self, user):
        # is this a d.py bug? size 2048 isn't allowed.
        # while it is a valid size for avatars.
        return user.avatar_url_as(format="png", size=1024).replace("1024", "2048")

    @commands.command()
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def triggered(self, ctx, user: discord.Member = None):
        """TRI GGE RED"""
        if not user:
            user = ctx.author
        async with ctx.typing():
            await ctx.send(file=discord.File(await self.client.triggered(self.av(user)), "triggered.gif"))

    @commands.command()
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def blame(self, ctx, *, text: str):
        """Blame something or someone"""
        if len(ctx.message.mentions) >= 1:
            text = ctx.message.mentions[0].display_name
        async with ctx.typing():
            await ctx.send(file=discord.File(await self.client.blame(text), "blame.png"))

def setup(bot):
    bot.add_cog(Canvas(bot))