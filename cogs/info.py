import discord
from discord.ext import commands
import psutil
from utils.utils import channel_count
import platform
import sys

class Info:
    """Commands for getting information about various things"""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(aliases=["botinfo", "info", "stats"])
    async def bot(self, ctx):
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
        em.add_field(name="Memory Usage", value=f"{used} MB ({percent}%)")
        em.add_field(name="GitHub", value=f"[Click Here](https://github.com/freetnt5852/LadyBug-Bot)")
        em.add_field(name="Discord Server", value=f"[Click Here](https://discord.gg/mDkMbEh)")
        em.add_field(name="Language/Library", value="[Python](https://python.org)/[discord.py 1.0.0a](https://github.com/Rapptz/discord.py/blob/rewrite)")
        v = sys.version_info
        em.add_field(name="Python Version", f"{v.major}.{v.minor}.{v.micro}")
        em.add_field(name="Platform", value=platform.platform())
        em.set_footer(text="LadyBug Bot by Free TNT#5796")
        