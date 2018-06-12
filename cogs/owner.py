import discord
from discord.ext import commands
import copy

class Owner:
    """Core class for owner commands"""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command()
    @commands.is_owner()
    async def sudo(self, ctx, user: discord.Member, *, command):
        """Calls a command on behalf of another person"""
        ctx.message.content = f"{ctx.prefix}{command}"
        ctx.author = user
        cmd = self.bot.get_command(command)
        if not cmd:
            return await ctx.send(f"Command `{command}` does not exist")
        ctx.command = cmd
        await self.bot.invoke(ctx)

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

def setup(bot):
    bot.add_cog(Owner(bot))        