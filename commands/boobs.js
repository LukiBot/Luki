const superagent = require('superagent')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.channel.nsfw == true) {
        superagent.get('http://api.oboobs.ru/boobs/0/1/random')
        .end((err, response) => {    
              message.channel.send({ file: `http://media.oboobs.ru/${response.body[0].preview}` });
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
  name: "boobs",
  category: "NSFW",
  description: "it sends boobs picture, what were you expected?",
  usage: "boobs"
};
