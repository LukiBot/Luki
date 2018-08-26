const figlet = require('figlet');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if(args.join(' ').length > 14) return message.channel.send('Only 14 characters are admitted!') 
  if (!args.join(' ')) return message.channel.send('Please, provide text to format in ASCII! Usage: \`ascii text\`'); 
    figlet(args.join(' '), (err, data) => {
      message.channel.send('```' + data + '```')
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ascii",
  category: "Fun",
  description: "just an ascii command",
  usage: "ascii text"
};
