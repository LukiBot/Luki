exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const { get } = require('superagent')
    .get('https://random-d.uk/api/v1/random?type=jpg')
        .end((err, response) => {
          message.channel.send(response.body.url);
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "duck",
    category: "Fun",
    description: "Post a random image of a duck",
    usage: "duck"
};
