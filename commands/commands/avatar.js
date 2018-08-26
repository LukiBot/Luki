exports.run = (client, msg, args) => {
    let avatar = msg.mentions.users.size ? msg.mentions.users.first().avatarURL() : msg.author.avatarURL();
    if (msg.mentions.users.size > 0) {
        msg.channel.send(`Avatar for, **${msg.mentions.users.first().username}:**\n${avatar}`);
    } else {
      msg.channel.send(`Avatar for, **${msg.author.username}:**\n${avatar}`);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "avatar",
    category: "Information",
    description: "Fetches a user\'s avatar.",
    usage: "avatar @user"
  };
  