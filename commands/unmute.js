exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-varsthor
    if (message.member.permissions.has("MUTE_MEMBERS") == true) {
        let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    var guild = client.guilds.find("id", message.guild.id);
    var mutedRole = message.guild.roles.find("name", "Muted");
    if (mutedRole == null)
    	return;
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    if (member.roles.find("id", mutedRole.id) == null) {
      return message.reply(`I cannnot unmute someone who is not muted!`);
    }
    await member.removeRole(mutedRole)
      .catch(error => {
        return message.reply(`Sorry ${message.author} I couldn't mute this user`);
      });
    message.reply(`${member.user.tag} has been unmuted by ${message.author.tag} because: ${reason}`);
    client.modlog(message.guild.id, "Unmute", message.author.tag, member.user.tag, reason, "00FF00")
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
    name: "unmute",
    category: "Moderation",
    description: "Unmute a user",
    usage: "unmute @user reason"
  };
  

