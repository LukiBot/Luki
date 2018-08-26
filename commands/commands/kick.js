exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-varsthor
    if (message.member.permissions.has("KICK_MEMBERS") == true) {
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if (member.user.id == message.author.id)
      return message.channel.send("You cannot kick yourself!");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    client.modlog(message.guild.id, "Kick", message.author.tag, member.user.tag, reason, "FFA500")
   } else {
        message.channel.send("You don't have enough permissions to use this command!")
    }
};
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "kick",
    category: "Moderation",
    description: "Kick user from the server",
    usage: "kick @user reason"
  };
  