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

    @commands.command()
    async def ping(self, ctx):
        """Checks if bot is working and measures websocket latency"""
        await ctx.send(f"Pong! WebSocket Latency: **{self.bot.latency * 1000:.4f} ms**")

    @commands.command()
    async def invite(self, ctx):
        """Want me in your server?"""
        await ctx.send(f"Invite me to your server: https://discordapp.com/oauth2/authorize?client_id={self.bot.user.id}&scope=bot&permissions=470281463")
    
    @commands.command()
    @commands.cooldown(1, 60, commands.BucketType.user)
    async def suggest(self, ctx, *, idea: str):
        channel = self.bot.get_channel(460801007769616394)
        if len(idea) > 1024:
            return await ctx.send("Idea too long, please keep it below 1024 chars.")
        em = discord.Embed(color=0xff0000)
        em.title = "New Suggestion"
        em.description = idea
        em.set_footer(text=f"User ID: {ctx.author.id}")
        em.set_thumbnail(url=ctx.author.avatar_url)
        em.set_author(name=str(ctx.author), icon_url=ctx.author.avatar_url)
        msg = await channel.send(embed=em)
        await msg.add_reaction("✅")
        await msg.add_reaction("❌")
        res = " to the support server" if ctx.guild.id != 397479560876261377 else ""
        await ctx.send(f"You idea has been successfully submitted{res}, we will reply to you in DM if we have any feedback.")

def setup(bot):
    bot.add_cog(General(bot))