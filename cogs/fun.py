import discord
from discord.ext import commands
import random
from ext.paginator import Paginator

class Fun:
    """Some fun commands."""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(aliases=["8ball"])
    async def eightball(self, ctx, *, question: str):
        """Ask the magic 8ball anything."""
        responses = [
          "It is certain",
          "It is decidedly so",
          "without a doubt",
          "Yes definitely",
          "You may rely on it",
          "As I see it, Yes",
          "Most likely",
          "Outlook good",
          "Yes",
          "Signs point to yes",
          "Reply hazy try again",
          "Ask again later",
          "Better not tell you now",
          "Cannot predict now",
          "Concentrate and ask again",
          "Dont count on it",
          "My reply is no",
          "My sources say no",
          "Outlook not so good",
          "Very doubtful"
        ]
        await ctx.send(f"**Question**```{question}```\n**8ball**```{random.choice(responses)}```")

    @commands.command(aliases=["ud"])
    async def urban(self, ctx, *, term: str):
        """Get a term from urban dictionary!"""
        try:
            resp = await (await self.bot.session.get(f"https://api.urbandictionary.com/v0/define?term={term}")).json()
            pages = []
            for x in resp["list"]:
                pages.append(f"{x['definition']}\n\n*{x['example']}*\n\n**Votes**\n:thumbsup: {x['thumbs_up']} :thumbsdown: {x['thumbs_down']}")
            paginator = Paginator(ctx, pages=pages, page_count=True)
            await paginator.run()
        except Exception as e:
            await ctx.send(f"Unknown term.```{e}```")
        

def setup(bot):
    bot.add_cog(Fun(bot))