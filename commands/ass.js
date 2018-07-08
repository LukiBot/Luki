const superagent = require('superagent')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.channel.nsfw == true) {
        superagent.get('https://nekobot.xyz/api/image')
        .query({ type: 'ass'})
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
  name: "ass",
  category: "NSFW",
  description: "it sends ass picture, what were you expected?",
  usage: "ass"
};
