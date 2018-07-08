const superagent = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    superagent.get('https://animals.anidiots.guide/lion')
        .end((err, response) => {
          message.channel.send({ file: response.body.link });
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
    category: "Animals",
    description: "Post a random image of a lion",
    usage: "lion"
};
