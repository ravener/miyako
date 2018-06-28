import discord
from discord.ext import commands
from bs4 import BeautifulSoup
import re

class Utils:
    """Utility commands to make your life easier"""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(aliases=["g"])
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def google(self, ctx, *, query: str):
        """Searches google for a query"""
        params = { "q": query, "safe": "off" if ctx.channel.nsfw else "on" }
        headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36" }
        try:
            async with ctx.typing():
                res = await self.bot.session.get("https://google.com/search", params=params, headers=headers)
                if res.status != 200:
                    return await ctx.send("Google has failed to respond.")
                html = await res.text()
                data = BeautifulSoup(html, "lxml")
                a = data.find_all("h3", { "class": "r" })
                if len(a) < 1:
                    return await ctx.send("No Results Found.")
                elem = a[0].find("a")
                if not elem:
                    return await ctx.send("No Results Found.")
                url = elem.get("href")
                regex = r".*(&sa=.*)"
                m = re.match(regex, url)
                if m:
                    url = url.replace(m.group(1), "")
                url = url.replace("/url?q=", "")
                await ctx.send(f"{elem.text} {url}")
        except Exception as e:
            await ctx.send("Something went wrong, please try again later.")
            raise e

    @commands.command()
    async def poll(self, ctx, *, choices: str):
        choices = choices.split("|")
        if len(choices) < 3:
            return await ctx.send("Not enough choices")
        try:
            await ctx.message.delete()
        except discord.Forbidden:
            pass
        question = choices[0]
        if len(question) > 1024:
            return await ctx.send("Question too long!")
        emojis = [ "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟" ]
        choices_len = len(choices) - 1
        emojis = emojis[:choices_len]
        choice_map = list(map(lambda x: f"{choices[1:].index(x) + 1}. {x}", choices))
        msg = "\n".join(choice_map)
        if len(msg) > 2048:
            return await ctx.send("Results too long, make sure total chars of all answers is less than 2000")
        em = discord.Embed(color=0xff0000)
        em.title = question
        em.description = msg
        em.set_footer(text=f"Asked by {ctx.author}", icon_url=ctx.author.avatar_url)
        message = await ctx.send(embed=em)
        for e in emojis:
            try:
                await message.add_reaction(e)
            except discord.Forbidden:
                pass
        
        
 
def setup(bot):
    bot.add_cog(Utils(bot))   