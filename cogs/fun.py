import discord
from discord.ext import commands
import random
from ext.paginator import Paginator
from bs4 import BeautifulSoup
import os
import box

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
            async with ctx.typing():
                res = await (await self.bot.session.get("https://api.reddit.com/u/kerdaloo/m/dankmemer/top/.json?sort=top&t=day&limit=500")).json()
                meme = random.choice(res["data"]["children"])["data"]
                em = discord.Embed(color=0xff0000)
                em.title = meme["title"]
                em.set_image(url=meme["preview"]["images"][0]["source"]["url"])
                em.set_footer(text=f"👍 {meme['ups']}, 👎 {meme['downs']}")
                await ctx.send(embed=em)
        except Exception as e:
            await ctx.send("Something went wrong, please try again later.")
            raise e

    @commands.command(aliases=["fuckmylife"])
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def fml(self, ctx):
        try:
            async with ctx.typing():
                res = await self.bot.session.get("http://www.fmylife.com/random")
                html = await res.text()
                data = BeautifulSoup(html, "lxml")
                article = data.find_all("p", { "class": "block" })[0].text
                em = discord.Embed(color=0xff0000)
                em.title = "Fuck My Life"
                em.description = article
                em.set_footer(text=f"Requested by: {ctx.author} | Powered by fmylife.com")
                await ctx.send(embed=em)
        except Exception as e:
            await ctx.send("Something went wrong, please try again later.")
            raise e

    @commands.command(aliases=["fn", "fnprofile"])
    @commands.cooldown(1, 2, commands.BucketType.default)
    async def fortnite(self, ctx, platform: str, *, username: str):
        """Gets your fortnite stats"""
        if not platform.lower() in ("xbl", "psn", "pc"):
            return await ctx.send("Invalid platform, platform can be one of `xbl, psn, pc`")
        async with ctx.typing():
            try:
                res = await self.bot.session.get(f"https://api.fortnitetracker.com/v1/profile/{platform.lower()}/{username}", headers={ "TRN-Api-Key": os.environ.get("FORTNITE") })
                if res.status == 404:
                    return await ctx.send("Could not find that username")
                resp = box.Box(await res.json())
                em = discord.Embed(color=0xff0000)
                em.title = resp.epicUserHandle
                em.description = f"Profile for {resp.epicUserHandle} in platform {resp.platformNameLong}"
                em.set_author(name=str(ctx.author), icon_url=ctx.author.avatar_url)
                em.set_thumbnail(url="https://cdn.discordapp.com/attachments/460894620545449986/461579014394609665/IMG_20180627_200804.png")
                em.add_field(name="Solo", value=f"**Wins:** {resp.stats.p2.top1.value}\n**Top 25:** {resp.stats.p2.top25.displayValue}\n**Top 10:** {resp.stats.p2.top10.displayValue}\n**KD:** {resp.stats.p2.kd.displayValue}\n**Win Ratio:** {resp.stats.p2.winRatio.displayValue}%\n**Time Played:** ${resp.stats.p2.minutesPlayed.displayValue}\n**Kills:** {resp.stats.p2.kills.displayValue}\n**Matches Played:** {resp.stats.p2.matches.displayValue}\n**Kills Per Match:** {resp.stats.p2.kpg.displayValue}\n**Average Time Played:** {resp.stats.p2.avgTimePlayed.displayValue}")
                em.add_field(name="Duos", value=f"**Wins:** {resp.stats.p10.top1.value}\n**Top 5:** {resp.stats.p10.top5.displayValue}\n**Top 12:** {resp.stats.p10.top12.displayValue}\n**KD:** {resp.stats.p10.kd.displayValue}\n**Win Ratio:** {resp.stats.p10.winRatio.displayValue}%\n**Time Played:** {resp.stats.p10.minutesPlayed.displayValue}\n**Kills:** {resp.stats.p10.kills.displayValue}\n**Matches Played:** {resp.stats.p10.matches.displayValue}\n**Kills Per Match:** {resp.stats.p10.kpg.displayValue}\n**Average Time Played:** {resp.stats.p10.avgTimePlayed.displayValue}")
                em.add_field(name="Squads", value=f"**Wins:** {resp.stats.p9.top1.value}\n**Top 3:** {resp.stats.p9.top3.displayValue}\n**Top 6:** {resp.stats.p9.top6.displayValue}\n**KD:** {resp.stats.p9.kd.displayValue}\n**Win Ratio:** {resp.stats.p9.winRatio.displayValue}%\n**Time Played:** {resp.stats.p9.minutesPlayed.displayValue}\n**Kills:** {resp.stats.p9.kills.displayValue}\n**Matches Played:** {resp.stats.p9.matches.displayValue}\n**Kills Per Match:** {resp.stats.p9.kpg.displayValue}\n**Average Time Played:** {resp.stats.p9.avgTimePlayed.displayValue}")
                em.add_field(name="\u200b", value="\u200b")
                em.add_field(name="Life Time Stats", value=f"**Score**: {resp.lifeTimeStats[6].value}\n**Matches Played:** {resp.lifeTimeStats[7].value}\n**Wins:** {resp.lifeTimeStats[8].value}\n**Win Ratio:** {resp.lifeTimeStats[9].value}\n**Kills:** {resp.lifeTimeStats[10].value}\n**KD:** {resp.lifeTimeStats[11].value}\n**Time Played:** {resp.lifeTimeStats[13].value}\n**Average Survival Time:** {resp.lifeTimeStats[14].value}")
                await ctx.send(embed=em)
            except Exception as e:
                await ctx.send("Something went wrong, please try again later.")
                raise e
            

def setup(bot):
    bot.add_cog(Fun(bot))