const Discord = require("discord.js")

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const suggestion = args.slice().join(" ");
  if (!args[0]) return message.channel.send("Please specify a suggestion");
  const channel = client.channels.get('366331400292401152')
  const embed = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL())
  .setDescription(suggestion)
  .setTimestamp()
  .setFooter(`Suggestion by ${message.author.tag} from ${message.guild.name}`)
  channel.send(embed)
    .then(function (message) {
      message.react("👍")
      message.react("👎")
    });
  message.channel.send("Posted :ok_hand:")
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "suggest",
  category: "General",
  description: "It will post a suggestion at Luki's support guild",
  usage: "suggest texttttttt"
};
