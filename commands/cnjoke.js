const superagent = require('superagent')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
        superagent.get('http://api.icndb.com/jokes/random')
        .end((err, response) => {
          message.channel.send(response.body.value.joke);
        });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "cnjoke",
  category: "Fun",
  description: "it tells you Chuck Norris joke",
  usage: "cnjoke"
};
