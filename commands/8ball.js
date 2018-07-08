const { RichEmbed } = require("discord.js");
const Discord = require("discord.js")
function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (!args[1]) return message.reply("Please ask a full question!");
    var replies = ["It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"];    
    let result = Math.floor((Math.random() * replies.length));

    let question = args.slice().join(" ");

    let embedz = new Discord.RichEmbed()
        .setAuthor(message.author.username + " asks: " + question)
        .addField("Answer", replies[result] + "")

    message.channel.send(embedz)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "8ball",
    category: "Fun",
    description: "Ask the magic 8ball a question",
    usage: "8ball question?"
};
