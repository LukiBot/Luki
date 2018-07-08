const superagent = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    superagent.get('https://dog.ceo/api/breeds/image/random')
        .end((err, response) => {
          message.channel.send({ file: response.body.message });
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "dog",
    category: "Animals",
    description: "Post a random image of a dog",
    usage: "dog"
};
