
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const { get } = require('superagent')
    .get('https://animals.anidiots.guide/lion')
        .end((err, response) => {
          message.channel.send( response.body.link );
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "lion",
    category: "Fun",
    description: "Post a random image of a lion",
    usage: "lion"
};
