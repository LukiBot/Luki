
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const { get } = require('superagent')
    .get('https://randomfox.ca/floof/')
        .end((err, response) => {
          message.channel.send(response.body.image);
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "fox",
    category: "Fun",
    description: "Post a random image of a fox",
    usage: "fox"
};
