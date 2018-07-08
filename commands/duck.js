const superagent = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    superagent.get('https://random-d.uk/api/v1/random?type=jpg')
        .end((err, response) => {
          message.channel.send({ file: response.body.url });
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
    category: "Animals",
    description: "Post a random image of a duck",
    usage: "duck"
};
