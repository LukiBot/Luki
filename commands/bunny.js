const superagent = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    superagent.get('https://api.bunnies.io/v2/loop/random/?media=gif,png')
        .end((err, response) => {
          message.channel.send({ file: response.body.media.poster });
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
    category: "Animals",
    description: "Post a random image of a bunny",
    usage: "bunny"
};
