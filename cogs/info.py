import discord
from discord.ext import commands
import psutil
from utils.utils import channel_count
import platform
import sys
import datetime

class Info:
    """Commands for getting information about various things"""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(name="bot", aliases=["botinfo", "info", "stats"])
    async def _bot(self, ctx):
        """Some information about the bot."""
        em = discord.Embed(color=0xff0000)
        em.title = "Bot Information/Stats"
        RAM = psutil.virtual_memory()
        used = RAM.used >> 20
        percent = RAM.percent
        em.set_thumbnail(url=self.bot.user.avatar_url)
        em.description = "Here is some useful stats about the bot."
        em.add_field(name="Servers", value=str(len(self.bot.guilds)))
        em.add_field(name="Users", value=str(len(self.bot.users)))
        em.add_field(name="Channels", value=str(channel_count(self.bot)))
        em.add_field(name="Memory Usage (Virtual Memory)", value=f"{used} MB ({percent}%)")
        em.add_field(name="GitHub", value=f"[Click Here](https://github.com/freetnt5852/LadyBug-Bot)")
        em.add_field(name="Discord Server", value=f"[Click Here](https://discord.gg/mDkMbEh)")
        em.add_field(name="Language/Library", value="[Python](https://python.org)/[discord.py 1.0.0a](https://github.com/Rapptz/discord.py/blob/rewrite)")
        v = sys.version_info
        em.add_field(name="Python Version", value=f"{v.major}.{v.minor}.{v.micro}")
        em.add_field(name="Platform", value=platform.platform())
        em.add_field(name="Commands Ran", value=str(self.bot.commands_ran))
        em.set_footer(text="LadyBug Bot by Free TNT#5796")
        await ctx.send(embed=em)
    
    @commands.command(aliases=["updates", "announcements"])
    async def news(self, ctx):
        """Gets latest announcements of the bot"""
        try:
            data = await self.bot.db.psa.find_one({ "_id": "psa" })
            if not data:
                return await ctx.send("There is no any announcements at this time.")
            em = discord.Embed(color=0xff0000)
            em.title = "News"
            em.description = data["psa"]
            em.set_footer(text=f"Published at {data['day']}/{data['month']}/{data['year']}")
            em.set_thumbnail(url=self.bot.user.avatar_url)
            await ctx.send(embed=em)
        except Exception as err:
            await ctx.send("Something went wrong, please try again later.")
            raise err

    @commands.command(aliases=["ui"])
    @commands.guild_only()
    async def userinfo(self, ctx, user: discord.Member = None):
        """Gets some info about a user"""
        if not user:
            user = ctx.author
        member_number = sorted(ctx.guild.members, key=lambda m: m.joined_at).index(user) + 1
        em = discord.Embed(color=0xff0000)
        em.title = "User Info"
        em.set_author(name=str(user), icon_url=user.avatar_url)
        em.set_thumbnail(url=user.avatar_url)
        em.add_field(name="Nickname", value=user.nick)
        em.add_field(name="Member Number", value=member_number)
        if user.activity:
            em.add_field(name="Activity", value=user.activity.name)
        time = user.joined_at.strftime("%A %h %d/%m/%Y")
        days = (datetime.datetime.now() - user.joined_at).days
        created_time = user.created_at.strftime("%A %h %d/%m/%Y")
        created_days = (datetime.datetime.now() - user.created_at).days
        em.add_field(name="Joined at", value=f"{time} ({days} Days ago!)")
        em.add_field(name="Account Created At", value=f"{created_time} ({created_days} Days ago!)")
        em.add_field(name="Status", value=user.status.name.title())
        await ctx.send(embed=em)
        
def setup(bot):
    bot.add_cog(Info(bot))