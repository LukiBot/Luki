
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const { get } = require('superagent')
        .get('https://api.bunnies.io/v2/loop/random/?media=gif,png')
        .end((err, response) => {
          message.channel.send(response.body.media.poster);
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "bunny",
    category: "Fun",
    description: "Post a random image of a bunny",
    usage: "bunny"
};
