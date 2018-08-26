const Discord = require('discord.js');


exports.run = async (client, msg, args, level) => {
  if (!args[0]) return msg.channel.send('**Please Include an IP address**\n`l.mcserver mc.hypixel.net`');
     var ip = args[0].toLowerCase(); 
      let embed = new Discord.MessageEmbed()
      .setImage(`http://status.mclive.eu/${ip}/${ip}/banner.png`)
  msg.channel.send(embed)
  .catch(error => {
    msg.channel.send(`IP: ${ip} not found!`);
})
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "mcserver",
    category: "Game Statics",
    description: "Display relevant information about Minecraft server",
    usage: "mcservere ip"
};
