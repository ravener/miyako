import discord
from discord.ext import commands
from ext.context import Context
import os
import subprocess
from utils.utils import paginate
from contextlib import redirect_stdout
import textwrap
import traceback
import inspect
import datetime
import io

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
            for x in self.bot.cogs_list:
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
            for x in self.bot.cogs_list:
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

    @commands.command(name="eval", aliases=["ev"])
    @commands.is_owner()
    async def _eval(self, ctx, *, body):
        """Evaluates python code."""
        env = {
            "bot": self.bot,
            "ctx": ctx,
            "channel": ctx.channel,
            "author": ctx.author,
            "guild": ctx.guild,
            "message": ctx.message,
            "msg": ctx.message,
            "_": self.bot._last_result,
            "source": inspect.getsource,
            "src": inspect.getsource,
            "session": self.bot.session
        }

        env.update(globals())

        body = self.cleanup_code(body)
        stdout = io.StringIO()
        err = out = None

        to_compile = f'async def func():\n{textwrap.indent(body, "  ")}'

        try:
            exec(to_compile, env)
        except Exception as e:
            err = await ctx.send(f'```py\n{e.__class__.__name__}: {e}\n```')
            return await ctx.message.add_reaction('\u2049')

        func = env['func']
        try:
            with redirect_stdout(stdout):
                ret = await func()
        except Exception as e:
            value = stdout.getvalue()
            err = await ctx.send(f'```py\n{value}{traceback.format_exc()}\n```')
        else:
            value = stdout.getvalue()
            if ret is None:
                if value:
                    try:

                        out = await ctx.send(f'```py\n{value}\n```')
                    except:
                        paginated_text = paginate(value)
                        for page in paginated_text:
                            if page == paginated_text[-1]:
                                out = await ctx.send(f'```py\n{page}\n```')
                                break
                            await ctx.send(f'```py\n{page}\n```')
            else:
                self.bot._last_result = ret
                try:
                    out = await ctx.send(f'```py\n{value}{ret}\n```')
                except:
                    paginated_text = paginate(f"{value}{ret}")
                    for page in paginated_text:
                        if page == paginated_text[-1]:
                            out = await ctx.send(f'```py\n{page}\n```')
                            break
                        await ctx.send(f'```py\n{page}\n```')

        if out:
            await ctx.message.add_reaction('\u2705')  # tick
        elif err:
            await ctx.message.add_reaction('\u2049')  # x
        else:
            await ctx.message.add_reaction('\u2705')

    @commands.command()
    @commands.is_owner()
    async def psa(self, ctx, *, msg: str):
        """Publishes an announcement"""
        if len(msg) > 1024:
            return await ctx.send("Message too long.")
        if msg.lower() == "delete":
            await self.bot.db.psa.delete_one({ "_id": "psa" })
            return await ctx.send("Deleted the current PSA")
        time = datetime.datetime.now()
        await self.bot.db.psa.update_one({ "_id": "psa" }, { "$set": { "psa": msg, "day": time.day, "month": time.month, "year": time.year } }, upsert=True)
        await ctx.send("Announcement successfully sent.")
    
    @commands.command(aliases=["src"])
    @commands.is_owner()
    async def source(self, ctx, command: str):
        cmd = self.bot.get_command(command)
        if not cmd:
            return await ctx.send(f"Command `{command}` not found.")
        await ctx.paginate(inspect.getsource(cmd.callback), "```py\n", "\n```")


def setup(bot):
    bot.add_cog(Owner(bot))        