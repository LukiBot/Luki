
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const { get } = require('superagent')
    .get('https://nekos.life/api/v2/img/lizard')
        .end((err, response) => {
          message.channel.send( response.body.url );
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "lizard",
    category: "Fun",
    description: "Post a random image of a lizard",
    usage: "lizard"
};
