const superagent = require('superagent')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.channel.nsfw == true) {
        superagent.get('https://nekobot.xyz/api/image')
        .query({ type: 'hentai_anal'})
        .end((err, response) => {
          message.channel.send({ file: response.body.message });
        });
    } else {
        message.channel.send({embed: {
            description: "this isn't NSFW channel!"
        }})
    }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "hentai",
  category: "NSFW",
  description: "it sends hentai picture, what were you expected?",
  usage: "hentai"
};
