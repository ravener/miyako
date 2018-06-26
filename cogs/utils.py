import discord
from discord.ext import commands
from bs4 import BeautifulSoup

class Utils:
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(aliases=["g"])
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def google(self, ctx, *, query: str):
        """Searches google"""
        params = { "q": query, "safe": str(ctx.channel.nsfw).lower() }
        headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36" }
        try:
            async with ctx.typing():
                res = await self.bot.session.get("https://google.com/search", params=params, headers=headers)
                html = await res.text()
                data = BeautifulSoup(html, "lxml")
                a = data.find_all("h3", { "class": "r" })
                if len(a) < 1:
                    return await ctx.send("No Results Found.")
                elem = a[0].find("a")
                if not elem:
                    return await ctx.send("No Results Found.")
                await ctx.send(f"{elem.text} {elem.get('href')}")
        except Exception as e:
            await ctx.send("Something went wrong, please try again later.")
            raise e
    