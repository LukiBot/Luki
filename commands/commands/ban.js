exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-varsthor
    if (message.member.permissions.has("BAN_MEMBERS") == true) {
        let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if (member.user.id == message.author.id)
      return message.reply("You cannot ban yourself!");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    client.modlog(message.guild.id, "Ban", message.author.tag, member.user.tag, reason, "FF0000")
  } else {
    message.channel.send("You don't have enough permissions to use this command!");
  }
};
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "ban",
    category: "Moderation",
    description: "Ban user from the server",
    usage: "ban @user reason"
  };
  