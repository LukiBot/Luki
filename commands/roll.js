
exports.run = async (client, msg, args, level) => { // eslint-disable-line no-unused-vars
  msg.channel.send(`:game_die: **${msg.author.username}**, you rolled a **${Math.floor(Math.random() * 6) + 1}**!`) 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "roll",
  category: "Fun",
  description: "Roll random number",
  usage: "roll"
};
