import asyncio
import discord

class Paginator(object):
    """Paginator class to paginate set of embeds with reactions"""
    def __init__(self, ctx, pages=[], timeout=30, **options):
        self.ctx = ctx
        self.message = None
        self.pages = pages
        self.timeout = timeout
        self.embed = options.get("embed") or discord.Embed()
        self.color = options.get("color", discord.Color.red())
        self.embed.color = self.color
        self.current_page = 0
        self.killed = False
        self.emojis = {
          "⏮": self.first_page,
          "◀": self.previous_page,
          "⏹": self.kill,
          "▶": self.next_page,
          "⏭": self.last_page
        }
        self.show_page_count = options.get("page_count", False)
        
    async def add_reactions(self):
        if not self.ctx.message:
            raise Exception("Pagination message is not sent yet")
        for x in self.emojis.keys():
            if len(self.pages) == 2 and x in "⏮⏭":
                continue
            await self.message.add_reaction(x)
    
    async def show_page(self, index: int):
        if self.killed: return
        if not self.message:
            self.embed.description = self.pages[0]
            if self.show_page_count:
                self.embed.title = f"Page {self.current_page + 1}/{len(self.pages)}"
            self.message = await self.ctx.send(embed=self.embed)
        else:
            page = self.pages[index]
            self.embed.description = page
            self.current_page = index
            if self.show_page_count:
                self.embed.title = f"Page {self.current_page + 1}/{len(self.pages)}"
            await self.message.edit(embed=self.embed)

    def check(self, rec, usr):
        if not self.message or self.killed: return False
        if rec.message.id != self.message.id: return False
        if usr.id != self.ctx.author.id: return False
        if rec.emoji in self.emojis.keys(): return True
        return False

    async def run(self):
        if not self.message:
            await self.show_page(0)
            await self.add_reactions()
        while not self.killed:
            try:
                rec, usr = await self.ctx.bot.wait_for("reaction_add", check=self.check, timeout=self.timeout)
            except asyncio.TimeoutError:
                await self.kill(delete=False)
            else:
                try:
                    await self.message.remove_reaction(rec, usr)
                except:
                    pass
                action = self.emojis.get(rec.emoji, False)
                if action:
                    await action()
                else:
                    pass

    async def first_page(self):
        await self.show_page(0)
    
    async def next_page(self):
        if self.current_page == len(self.pages) - 1:
            await self.show_page(0)
        else:
            await self.show_page(self.current_page + 1)

    async def kill(self, timeout=None, delete=True):
        if timeout:
            await asyncio.sleep(timeout)
            
        self.killed = True
        if self.message:
            try:
                await self.message.clear_reactions()
                if delete: await self.message.delete()
            except discord.Forbidden:
                pass
            except Exception as e:
                raise e

    async def previous_page(self):
        if self.current_page == 0:
            await self.show_page(len(self.pages) - 1)
        else:
            await self.show_page(self.current_page - 1)

    async def last_page(self):
        await self.show_page(len(self.pages) - 1) 