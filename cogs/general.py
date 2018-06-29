import discord
from discord.ext import commands
from ext.paginator import Paginator
from utils.utils import _command_signature

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
        await ctx.send(f"Invite me to your server: <https://discordapp.com/oauth2/authorize?client_id={self.bot.user.id}&scope=bot&permissions=470281463>")
    
    @commands.command()
    @commands.cooldown(1, 60, commands.BucketType.user)
    async def suggest(self, ctx, *, idea: str):
        """Suggest an idea to improve the bot"""
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
        if ctx.guild:
            res = " to the support server" if ctx.guild.id != 397479560876261377 else ""
        else:
            res = " to the support server"
        await ctx.send(f"You idea has been successfully submitted{res}, we will reply to you in DM if we have any feedback.")

    @commands.command(name="help", aliases=["h", "halp", "commands", "cmds"])
    async def _help(self, ctx, command: str = None):
        """Shows all commands"""
        if command:
            cmd = self.bot.get_command(command.lower()) or self.bot.get_cog(command)
            if not cmd:
                return await ctx.send(f"Command or category '{command}' not found.")
            if isinstance(cmd, commands.Command):
                em = discord.Embed(color=0xff0000)
                em.title = cmd.name
                em.description = cmd.help or "No Description"
                em.description += "\nUsage: `{}{}`".format(ctx.prefix, _command_signature(cmd))
                if cmd.aliases:
                    em.description += "\nAliases: `{}`".format(", ".join(cmd.aliases))
                return await ctx.send(embed=em)
            cmds = self.bot.get_cog_commands(command)
            em = discord.Embed(color=0xff0000)
            em.description = cmd.__doc__ + "\n\n`" if cmd.__doc__ else "No Description\n\n`" 
            em.set_footer(text=f"{ctx.prefix}help <cmd> for more info on a command.")
            for x in cmds:
                msg = f"{ctx.prefix}{x.signature} {x.short_doc}\n"
                em.description += msg
            em.description += "`"
            return await ctx.send(embed=em)
        else:
            cogs = self.bot.cogs.keys()
            pages = []
            for x in cogs:
                if x == "Owner" and ctx.author.id != 292690616285134850:
                    continue
                cmds = self.bot.get_cog_commands(x)
                cog = self.bot.get_cog(x)
                msg = cog.__class__.__name__ + "\n" + cog.__doc__ + "\n\n`" if cog.__doc__ else cog.__class__.__name__ + "\nNo Description\n\n`"
                for cmd in cmds:
                    if cmd.hidden:
                        continue
                    cmd_msg = f"{ctx.prefix}{_command_signature(cmd)} {cmd.short_doc}\n"
                    msg += cmd_msg
                msg += "`"
                pages.append(msg)
            em = discord.Embed(color=0xff0000)
            em.set_footer(text=f"{ctx.prefix}help <cmd> for more information on a command.")
            paginator = Paginator(ctx, pages=pages, page_count=True, embed=em)
            await paginator.run()

    @commands.command(aliases=["server", "discord"])
    async def support(self, ctx):
        """Get a link to our support server"""
        try:
            await ctx.author.send("Here's link to the server: https://discord.gg/mDkMbEh")
            if isinstance(ctx.channel, discord.TextChannel):
                await ctx.send("Check your DMs!")
        except discord.Forbidden:
            await ctx.send("Couldn't DM link, make sure you didn't block DMs from this server.")

def setup(bot):
    bot.add_cog(General(bot))