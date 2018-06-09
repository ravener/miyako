import discord
from discord.ext import commands

class Owner:
    """Core class for owner commands"""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    @commands.owner_only()
    async def sudo(self, ctx, user: discord.Member, command: str, *, args = None):
        """Calls a command on behalf of another person"""
        arg_dict = {}
        arr = args.split(",")
        for x in arr:
            split = x.split(":")
            name = split[0]
            value = split[1]
            arg_dict[name] = value
            
        ctx.author = user
        cmd = bot.get_command(command)
        if not cmd:
            return await ctx.send(f"Command {command} does not exist.")
        if len(args_dict) > 0:
            await ctx.invoke(cmd, **args_dict)
        else:
            await ctx.invoke(cmd)

def setup(bot):
    bot.add_cog(Owner(bot))        