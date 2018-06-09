import discord
from discord.ext import commands

class Owner:
    """Core class for owner commands"""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    @commands.is_owner()
    async def sudo(self, ctx, user: discord.Member, command: str, *, args = None):
        """Calls a command on behalf of another person"""
        args_dict = {}
        if args:
            arr = args.split(",")
            for x in arr:
                split = x.split(":")
                name = split[0]
                value = split[1]
                arg_dict[name] = value
            
        ctx.author = user
        cmd = self.bot.get_command(command)
        if not cmd:
            return await ctx.send(f"Command {command} does not exist.")
        if len(args_dict) > 0:
            await ctx.invoke(cmd, **args_dict)
        else:
            await ctx.invoke(cmd)

def setup(bot):
    bot.add_cog(Owner(bot))        