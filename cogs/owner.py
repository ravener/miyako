import discord
from discord.ext import commands
import copy
from ext.context import Context
import os
import subprocess
from utils.utils import paginate

class Owner:
    """Core class for owner commands"""
    def __init__(self, bot):
        self.bot = bot

    def cleanup_code(self, content):
        '''Automatically removes code blocks from the code.'''
        # remove ```py\n```
        if content.startswith('```') and content.endswith('```'):
            return '\n'.join(content.split('\n')[1:-1])
        return content.strip('` \n')


    @commands.command()
    @commands.is_owner()
    async def sudo(self, ctx, user: discord.Member, *, command):
        """Calls a command on behalf of another person"""
        msg = ctx.message
        msg.content = f"{ctx.prefix}{command}"
        msg.author = user
        context = await self.bot.get_context(msg, cls=Context)
        if not context.command:
            return await ctx.send(f"Command does not exist")
        await self.bot.invoke(context)

    @commands.command()
    @commands.is_owner()
    async def unload(self, ctx, cog: str = None):
        """Unloads all or a specific cog"""
        if not cog:
            return await ctx.send("Mention the cog you want to unload, or all to unload all")
        if cog.lower() == "all":
            for x in self.bot.cog_list:
                try:
                    if x == "cogs.owner":
                        continue
                    self.bot.unload_extension(f"cogs.{cog}")
                except Exception as e:
                    await ctx.send(f"Error unloading {x}\n```py\n{e}\n```")
            await ctx.send("Done unloading all cogs.")
        else:
            try:
                self.bot.unload_extension(f"cogs.{cog}")
                await ctx.send(f"Loaded {cog}!")
            except Exception as e:
                await ctx.send(f"Error unloading {cog}\n```py\n{e}\n```")

    @commands.command()
    @commands.is_owner()
    async def load(self, ctx, cog: str = None):
        """Loads all or a specific cog"""
        if not cog:
            return await ctx.send("Mention the cog you want to load, or all to load all")
        if cog.lower() == "all":
            for x in self.bot.cog_list:
                try:
                    self.bot.load_extension(f"cogs.{cog}")
                except Exception as e:
                    await ctx.send(f"Error loading {x}\n```py\n{e}\n```")
            await ctx.send("Done loading all cogs.")

        else:
            try:
                self.bot.load_extension(f"cogs.{cog}")
                await ctx.send(f"Loaded {cog}!")
            except Exception as e:
                await ctx.send(f"Error loading {cog}\n```py\n{e}\n```")

    @commands.command()
    @commands.is_owner()
    async def reload(self, ctx, cog: str = None):
        """Reloads all or a specific cog"""
        if not cog:
            return await ctx.send("Mention the cog you want to reload, or all to reload all")
        if cog.lower() == "all":
            for x in self.bot.cogs_list:
                try:
                    self.bot.unload_extension(x)
                    self.bot.load_extension(x)
                except Exception as e:
                    await ctx.send(f"Error loading {x}\n```py\n{e}\n```")
            await ctx.send("Done reloading all cogs.")
        else:
            try:
                self.bot.unload_extension(f"cogs.{cog}")
                self.bot.load_extension(f"cogs.{cog}")
                await ctx.send(f"Reloaded {cog}!")
            except Exception as e:
                await ctx.send(f"Error loading {cog}\n```py\n{e}\n```")

    @commands.command(name="exec", aliases=["bash", "shell"])
    @commands.is_owner()
    async def _exec(self, ctx, *, code: str):
        code = self.cleanup_code(code)
        res = subprocess.run(code, shell=True, cwd=os.getcwd(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        err = res.stderr.decode("utf-8")
        msg = res.stdout.decode("utf-8")
        if err:
            return await ctx.send(f"```\n{err}\n```")
        await ctx.paginate(msg, "```", "```")

def setup(bot):
    bot.add_cog(Owner(bot))
