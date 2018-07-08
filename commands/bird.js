const superagent = require("snekfetch");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    superagent.get('http://random.birb.pw/tweet/')
        .end((err, response) => {
          message.channel.send({ file: `https://random.birb.pw/img/${response.body}` });
        });
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "bird",
    category: "Animals",
    description: "Post a random image of a bird",
    usage: "bird"
};
