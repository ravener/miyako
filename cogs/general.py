import discord
from discord.ext import commands
from ext.paginator import Paginator

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

    @commands.command(name="help", aliases=["h", "halp", "commands", "cmds"])
    async def _help(self, ctx, command: str = None):
        if command:
            cmd = self.bot.get_command(command.lower()) or self.bot.get_cog(command)
            if not cmd:
                return await ctx.send(f"Command or category '{command}' not found.")
            if isinstance(cmd, commands.Command):
                em = discord.Embed(color=0xff0000)
                em.title = cmd.name
                em.description = cmd.help or "No Description"
                em.description += "\nUsage: {}{}".format(ctx.prefix, cmd.signature)
                return await ctx.send(embed=em)
            cmds = self.bot.get_cog_commands(command)
            em = discord.Embed(color=0xff0000)
            em.description = cmd.__doc__ or "No Description\n\n`"
            em.set_footer(text=f"{ctx.prefix}help <cmd> for more info on a command.")
            for x in cmds:
                msg = f"{ctx.prefix}{x.signature} {x.short_doc}\n"
                em.description += msg + "`"
            return await ctx.send(embed=em)
        else:
            cogs = list(map(lambda x: x.__class__.__name__, self.bot.cogs))
            pages = []
            for x in cogs:
                cmds = self.bot.get_cog_commands(x)
                cog = self.bot.get_cog(x)
                msg = x.__doc__ or "No Description\n\n`"
                for cmd in cmds:
                    msg += f"{ctx.prefix{cmd.signature} {cmd.short_doc}"
                msg += "`"
                pages.append(msg)
            em = discord.Embed(color=0xff0000)
            em.set_footer(text=f"{ctx.prefix}help <cmd> for more information on a command.")
            paginator = Paginator(ctx, pages=pages, page_count=True, embed=em)
            await paginator.run()


def setup(bot):
    bot.add_cog(General(bot))
