import Command from '../../structures/Command.js';

class Compliment extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Compliments a user.',
      usage: 'compliment [@user]',
      options: [
        {
          name: 'user',
          description: 'The user to compliment.',
          type: 'user',
          required: true
        }
      ]
    });
  }

  async run(ctx, options) {
    const user = options.getUser('user');

    if (user.id === this.client.user.id) {
      return ctx.reply('Thanks but you don\'t have to ask me to compliment myself. Baka!');
    }

    return ctx.reply(`${user}: ${compliments[Math.floor(Math.random() * compliments.length)]}`);
  }
}

export default Compliment;

const compliments = [
  'Your smile is contagious.',
  'You look great today.',
  'You\'re a smart cookie.',
  'I bet you make babies smile.',
  'You have impeccable manners.',
  'I like your style.',
  'You have the best laugh.',
  'I appreciate you.',
  'You are the most perfect you there is.',
  'You are enough.',
  'You\'re strong.',
  'Your perspective is refreshing.',
  'You\'re an awesome friend.',
  'You light up the room.',
  'You shine brighter than a shooting star.',
  'You deserve a hug right now.',
  'You should be proud of yourself.',
  'You\'re more helpful than you realize.',
  'You have a great sense of humor.',
  'You\'ve got all the right moves!',
  'Is that your picture next to \'charming\' in the dictionary?',
  'Your kindness is a balm to all who encounter it.',
  'You\'re all that and a super-size bag of chips.',
  'On a scale from 1 to 10, you\'re an 11.',
  'You are brave.',
  'You\'re even more beautiful on the inside than you are on the outside.',
  'You have the courage of your convictions.',
  'Your eyes are breathtaking.',
  'If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.',
  'You are making a difference.',
  'You\'re like sunshine on a rainy day.',
  'You bring out the best in other people.',
  'Your ability to recall random factoids at just the right time is impressive.',
  'You\'re a great listener.',
  'How is it that you always look great, even in sweatpants?',
  'Everything would be better if more people were like you!',
  'I bet you sweat glitter.',
  'You were cool way before hipsters were cool.',
  'That color is perfect on you.',
  'Hanging out with you is always a blast.',
  'You always know -- and say -- exactly what I need to hear when I need to hear it.',
  'You smell really good.',
  'You may dance like no one\'s watching, but everyone\'s watching because you\'re an amazing dancer!',
  'Being around you makes everything better!',
  'When you say, \'I meant to do that,\' I totally believe you.',
  'When you\'re not afraid to be yourself is when you\'re most incredible.',
  'Colors seem brighter when you\'re around.',
  'You\'re more fun than a ball pit filled with candy. (And seriously, what could be more fun than that?)',
  'That thing you don\'t like about yourself is what makes you so interesting.',
  'You\'re wonderful.',
  'You have cute elbows. For reals!',
  'Jokes are funnier when you tell them.',
  'You\'re better than a triple-scoop ice cream cone. With sprinkles.',
  'Your bellybutton is kind of adorable.',
  'Your hair looks stunning.',
  'You\'re one of a kind!',
  'You\'re inspiring.',
  'If you were a box of crayons, you\'d be the giant name-brand one with the built-in sharpener.',
  'You should be thanked more often. So thank you!!',
  'Our community is better because you\'re in it.',
  'Someone is getting through something hard right now because you\'ve got their back.',
  'You have the best ideas.',
  'You always know how to find that silver lining.',
  'Everyone gets knocked down sometimes, but you always get back up and keep going.',
  'You\'re a candle in the darkness.',
  'You\'re a great example to others.',
  'Being around you is like being on a happy little vacation.',
  'You always know just what to say.',
  'You\'re always learning new things and trying to better yourself, which is awesome.',
  'If someone based an Internet meme on you, it would have impeccable grammar.',
  'You could survive a Zombie apocalypse.',
  'You\'re more fun than bubble wrap.',
  'When you make a mistake, you fix it.',
  'Who raised you? They deserve a medal for a job well done.',
  'You\'re great at figuring stuff out.',
  'Your voice is magnificent.',
  'The people you love are lucky to have you in their lives.',
  'You\'re like a breath of fresh air.',
  'You\'re gorgeous -- and that\'s the least interesting thing about you, too.',
  'You\'re so thoughtful.',
  'Your creative potential seems limitless.',
  'Your name suits you to a T.',
  'You\'re irresistible when you blush.',
  'Actions speak louder than words, and yours tell an incredible story.',
  'Somehow you make time stop and fly at the same time.',
  'When you make up your mind about something, nothing stands in your way.',
  'You seem to really know who you are.',
  'Any team would be lucky to have you on it.',
  'In high school I bet you were voted \'most likely to keep being awesome.\'',
  'I bet you do the crossword puzzle in ink.',
  'Babies and small animals probably love you.',
  'If you were a scented candle they\'d call it Perfectly Imperfect (and it would smell like summer).',
  'You\'re someone\'s reason to smile.',
  'You\'re even better than a unicorn, because you\'re real.',
  'How do you keep being so funny and making everyone laugh?',
  'You have a good head on your shoulders.',
  'Has anyone ever told you that you have great posture?',
  'The way you treasure your loved ones is incredible.',
  'You\'re really something special.',
  'You\'re a gift to those around you.',
  'You deserve better.'
];
