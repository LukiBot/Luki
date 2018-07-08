const superagent = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    superagent.get('https://randomfox.ca/floof/')
        .end((err, response) => {
          message.channel.send({ file: response.body.image });
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
    category: "Animals",
    description: "Post a random image of a fox",
    usage: "fox"
};
