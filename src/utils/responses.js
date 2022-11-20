// Note: These are taken from https://github.com/NotAWeebDev/Misaki
// The bot has died but I really liked those responses and my own creativity is trash.
// TODO: Currently it's directly pasted from Misaki, modify a few things and remove ones we don't need.
// - Removed a few responses we don't need but still have to add a few more responses to feel a bit unique.

// Member Join
exports.welcomeMessages = [
  "O-ohayou gozaimasu **{{user}}-san**.",
  "Hmph, looks like **{{user}}**, another baka, has joined.",
  "It's not like I like you or anything... but welcome to the server **{{user}}**.",
  "O-oh, welcome **{{user}}-san**. I hope I haven't embarrased you...",
  "OwO who's this? **{{user}}** has joined the server.",
  "**{{user}}**, looks like you landed on the wrong side of Discord!",
  "Hi **{{user}}**! Welcome to **{{guild}}**, I hope you enjoy your stay!",
  "ERGH, why has **{{user}}** got to come, I already have to handle **{{amount}}** users!",
  "Y-yay! More people to deal with! Welcome **{{user}}**!",
  "Hi! Waifu/husbando **{{user}}** has joined the Academy!",
  "**{{user}}-san**, welcome to **{{guild}}**!"
];

// Member Leave
exports.goodbyeMessages = [
  "Awh, I-I have no words for t-this, b-but, I-I'll miss you **{{user}}-san**!",
  "Awh, **{{user}}** has left... n-not that I care! Baka!",
  "**{{user}}-san**.... N-no...",
  "**{{user}}** left, not like we needed them or anything.",
  "**{{user}}** why would you leave me here, alone!?",
  "**{{user}}** discovered the leave button.",
  "Eep! **{{user}}** left?! Th-they're always leaving me, that baka...",
  "Finally, I thought **{{user}}** would never leave!",
  "Woah! **{{user}}** left **{{guild}}**! B-baka, why did they even join?!",
  "Woo, **{{user}}** left, now I only have to handle **{{amount}}** users!"
];

// Level Up
exports.levelUpMessages = [
  "You've only become level **{{level}}**, peasant!",
  "YATTA! You leveled up, **{{user}}-san**! You're now level **{{level}}**, n-not that it means a-anything!",
  "E-eh? You leveled up? Well just because you're level **{{level}}** now, doesn't mean I'll like you more **{{user}}**... baka.",
  "Hmph, you leveled up to **{{level}}**, **{{user}}-san**. W-well, it makes no difference to me!",
  "Hyaa~! You've leveled up **{{user}}-san**, you're now level **{{level}}**.",
  "**{{user}}**, you baka. Don't leave me behind now that you're level **{{level}}**.",
  "**{{user}}-san**, don't forget me now just because you're level **{{level}}**",
  "Pfft, you've only just become level **{{level}}**, hurry up **{{user}}**.",
  "Ah nuts, **{{user}}** is getting smart, now with an I.Q. of **{{level}}**",
  "N-nani? You've reached level **{{level}}** so quickly...",
  "You're only level **{{level}}**? You disgust me!",
  "How can you be level **{{level}}** y-you baka!",
  "B-baka! You're at level **{{level}}**, now go be free! D-dummy...",
  "You're definitely level **{{level}}** you baka!",
];

// Commands
exports.pingMessages = [
  "Ugh, again? You always ask, and I tell you that I responded in **{{ms}}ms**.",
  "B-baka, I responded... just in **{{ms}}ms**.",
  "H-here you go, I responded in **{{ms}}ms**.",
  "Here you go, not that it was worth my time. It only took me **{{ms}}ms**.",
  "Is this right? I've responded in **{{ms}}ms**.",
  "**{{user}}**? I've responded in **{{ms}}ms**.",
  "**{{user}}**! You wasted **{{ms}}ms** of my time, ERGH",
  "D-did I do it right? I responded in **{{ms}}ms**.",
  "**{{user}}**, yes I'm here, and it took me **{{ms}}ms** to respond!",
  "**{{user}}** why are you pinging me man! You wasted **{{ms}}ms** of my time!!",
  "**{{user}}** hey, it took me **{{ms}}ms** to send this message",
  "You've made me **{{ms}}ms** older - just from asking.",
  "**{{user}}** I've seen your message and it took me **{{ms}}ms** not to care.",
  "Do you know how long it took me to read that message? You pretty much wasted **{{ms}}ms** of my day!",
  "B-baka! My ping is **{{ms}}ms**! Are you happy now?"
];

exports.dailySuccessMessages = [
  "Yatta! You've got **{{amount}}**.",
  "Well done, you've redeemed your daily **{{amount}}**!",
  "Finally I thought you were never going to claim your **{{amount}}** today!",
  "Your dad gave you **{{amount}}**? I get more than that every hour!",
  "You have claimed your daily **{{amount}}**, ain't that dandy?",
  "N-nani?! You got **{{amount}}**, woah...",
  "You just got **{{amount}}**? Maybe buy me dinner some time **{{user}}-san**? :wink:",
  "Oh goody, you finally got your **{{amount}}**. It's about time, now get me some Pocky."
];

exports.dailyFailureMessages = [
  "You cannot claim your daily reward yet, please try again in **{{time}}**",
  "Oh come on now, you know better than to ask ahead of time.. You can get your daily in **{{time}}**",
  "**{{user}}-san**, you already got your allowance today. You can get it in **{{time}}**",
  "This again? I told you to wait **{{time}}**",
  "Hey! Money is already tight around here. Ask in **{{time}}**",
  "You're gonna make m-me mad please wait **{{time}}** to claim again!"
];

exports.balanceMessages = [
  "Pfft, a measly **{{amount}}**? My father gives me more as an allowance!",
  "Only **{{amount}}**? That's nothing compared to my pocket money!",
  "**{{user}}-san**, you have **{{amount}}**, but you don't need it to make me happy.",
  "**{{user}}**, again? Ugh, you have **{{amount}}**... Jeez, maybe if you kept track of it you'd remember..."
];

exports.otherBalanceMessages = [
  "Why do you want to know **{{user}}**'s balance? Whatever, it's **{{amount}}** anyway.",
  "N-nani? **{{user}}-san**'s balance? It's **{{amount}}**..",
  "Why do you care so much about **{{user}}**'s balance? N-not that I care, it's **{{amount}}**.",
  "Some particular reason you want to know **{{user}}**'s balance? It's **{{amount}}**.",
  "Hm, one second... It's **{{amount}}**, but why do you want to know **{{user}}**'s balance?",
  "You've aleady asked for **{{user}}**'s balance, gosh! Anyway, it's **{{amount}}**."
];

exports.levelMessages = [
  "You're only level **{{level}}**, Not bad...",
  "Pfft, level **{{level}}**?",
  "**{{user}}** your level? It's **{{level}}**, baka",
  "**{{user}}**, again with this? Whatever, you're level **{{level}}**.",
  "**{{user}}-san** here you go, it's **{{level}}**.",
  "You're level **{{level}}**, maybe if you were a wee bit more active it'd be higher.",
  "Only a level **{{level}}**? Even I'm better than that.",
  "Level **{{level}}**? What, where you hoping to be higher than **{{level}}**?",
  "Only level **{{level}}**? Pfft! I've seen much better than that."
];

exports.otherLevelMessages = [
  "Look just ask **{{user}}** next time, but I will forgive you. Here, this is their level: **{{level}}**.",
  "Why do you want to view **{{user}}**'s level? Anyway they are level **{{level}}**."
];

// System

// Reload
exports.reloadMissingArg = [
  "N-nani?! I don't know what to do, you didn't give me anything!",
  "Baka! You are supposed to provide a command to reload!"
];

exports.reloadNotFound = [
  "Eeeh?! **{{user}}-san**, why would you ask me to find a command that doesn't exist, it wasn't even an alias.",
  "What are you doing? **{{command}}** doesn't exist! Baka!"
];

exports.reloadErr = [
  "**{{user}}-san**, I think I broke it... This happened: **{{response}}**",
  "There was an error, probably your fault! Baka! **{{response}}**",
  "Ugh, can't you do one thing right? You ended up breaking **{{command}}**. (**{{response}}**)",
  "**{{command}}** is broken... Not my fault or problem though! (**{{response}}**)"
];

exports.reloadSuccess = [
  "Yatta! **{{command}}** reloaded, now we can get back to what we were doing, or whatever you want to do...",
  "I've reloaded **{{command}}**, not that I could see any point in it..."
];

// After the following line is the end of Misaki code and are made by myself.

// Errors

exports.notNSFWChannel = [
  "Baka! What do you think you're doing? That command can only be used in NSFW channels.",
  "N-nani? Is this really the place to do that? That command can only be used in NSFW channels."
];

exports.guildOnlyCommand = [

];
