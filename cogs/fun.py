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
        q = question
        await ctx.send(f"**Question**```\n{q}\n```\n**8ball**```\n{random.choice(responses)}\n```")

    @commands.command(aliases=["ud"])
    @commands.guild_only()
    async def urban(self, ctx, *, term: str):
        """Get a term from urban dictionary!"""
        if not ctx.channel.nsfw:
            return await ctx.send(f"Due to urban having some inappropriate words and discord does not allow NSFW outside of NSFW channels we have made urban to work in NSFW channels only.")
        try:
            resp = await (await self.bot.session.get(f"https://api.urbandictionary.com/v0/define?term={term}")).json()
            pages = []
            for x in resp["list"]:
                pages.append(f"{x['definition']}\n\n*{x['example']}*\n\n**Votes**\n:thumbsup: {x['thumbs_up']} :thumbsdown: {x['thumbs_down']}")
            paginator = Paginator(ctx, pages=pages, page_count=True)
            await paginator.run()
        except Exception as e:
            await ctx.send(f"Unknown term.")

    @commands.command(aliases=["pick"])
    async def choose(self, ctx, *, choices):
        """Picks a random choice, sperate choices with commas"""
        split = choices.split(",")
        if len(split) < 2:
            return await ctx.send("Not enough choices to pick from.")
        await ctx.send(f"I think `{random.choice(split)}`")
        
    @commands.command()
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def meme(self, ctx):
        """Gets a random meme from r/dankmemes"""
        try:
            res = (await self.bot.session.get("https://api.reddit.com/u/kerdaloo/m/dankmemer/top/.json?sort=top&t=day&limit=500")).json()
            meme = random.choice(res["data"]["children"])["data"]
            em = discord.Embed(color=0xff0000)
            em.title = meme["title"]
            em.set_image(url=meme["preview"]["images"][0]["source"]["url"])
            em.set_footer(text=":thumbsup: {meme['ups']}, :thumbsdown: {data['downs']}")
            await ctx.send(embed=em)
        except Exception as e:
            await ctx.send("Something went wrong, please try again later.")
            raise e

def setup(bot):
    bot.add_cog(Fun(bot))