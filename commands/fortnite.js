const Client = require('fortnite');
const fortnite = new Client("");
const Discord = require('discord.js');


exports.run = async (client, msg, args, level) => {
  if (!['pc', 'xbl', 'psn'].includes(args[0])) return msg.channel.send('**Please Include valid platform**\n`j!fortnite pc/xbl/psn username`');
  if (!args[1]) return msg.channel.send('**Please Include username**\n`j!fortnite pc/xbl/psn username`');
     var platform = args[0];
     var playerName = args[1];
     fortnite.user(playerName, platform).then(data => {
      let embed = new Discord.RichEmbed()
      .setTitle(`${data.username} - ${data.platform}`)
      .addField("Solo", `**Wins:** \`${data.stats.solo.wins}\`\n**Kills:** \`${data.stats.solo.kills}\`\n**Matches Played:** \`${data.stats.solo.matches}\``)
      .addField("Due", `**Wins:** \`${data.stats.solo.wins}\`\n**Kills:** \`${data.stats.solo.kills}\`\n**Matches Played:** \`${data.stats.solo.matches}\``)
      .addField("squad", `**Wins:** \`${data.stats.solo.wins}\`\n**Kills:** \`${data.stats.solo.kills}\`\n**Matches Played:** \`${data.stats.solo.matches}\``)
  msg.channel.send(embed)
  .catch(error => {
    message.channel.send('Username not found!');
})
    }) 
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "fortnite",
    category: "Game Statics",
    description: "Display relevant information about Fortnite user",
    usage: "fortnite pc/xbl/psn username"
};