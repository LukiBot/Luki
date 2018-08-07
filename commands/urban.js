const { MessageEmbed} = require("discord.js");
const Discord = require("discord.js")
const urban = require('relevant-urban')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.channel.nsfw == true) {
    if (!args[0]) return message.channel.send(`***Please specify some text!***`);
    let res = await urban(args.join(' ')).catch(e => { 
    return message.channel.send('***Sorry, that word was not found!***');
  });
  const embed = new Discord.MessageEmbed()
  .setTitle(res.word)
  .setDescription(`**Definition:**\n*${res.definition}*\n\n**Example:**\n*${res.example}*`) 
  .addField('Author', res.author, true) 
  .addField('Rating', `**\`Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\`**`) 

if (res.tags.length > 0 && res.tags.join(' ').length < 1024) {
  embed.addField('Tags', res.tags.join(', '), true) 
}

message.channel.send(embed); 
} else {
    message.channel.send({embed: {
        description: "this isn't NSFW channel!"
    }})
}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "urban",
    category: "Fun",
    description: "Search for a definition on urban dictionary",
    usage: "urban term"
};
