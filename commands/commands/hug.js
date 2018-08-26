
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let user = message.mentions.users.first();
  if (!user) return message.channel.send("Please mention a user!")
  message.reply('You have hugged <@' + user.id + '>!')
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "hug",
  category: "Fun",
  description: "hug someone!",
  usage: "hug @user"
};
