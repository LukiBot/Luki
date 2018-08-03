exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-varsthor
    if (message.member.permissions.has("MUTE_MEMBERS") == true) {
        let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    var guild = client.guilds.find("id", message.guild.id);
    var mutedRole = message.guild.roles.find("name", "Muted");
    if (mutedRole == null) {
    	guild.createRole({name: "Muted", color: "GRAY"
    		, permissions: ["READ_MESSAGE_HISTORY"]
    	, mentionable: false}, "For muting people")
    	.then(role => {
    		mutedRole = role;
    		for (var gc in guild.channels.values()) {
    			if (gc.type == "text") {
    				gc.overwritePermissions(role, {
        				'SEND_MESSAGES': false,
        				'ADD_REACTIONS': false
        			}, "To mute people");
    			} else {
    				gc.overwritePermissions(role, {
        				'SPEAK': false
        			}, "To mute people")
    			}
    		}
      });
    } else {
      mutedRole = mutedRole;
    }
    if (member.roles.find("id", mutedRole.id) != null) {
      return message.reply(`I cannnot mute someone who is already muted!`);
    }
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    await member.addRole(mutedRole)
      .catch(error => {
        return message.reply(`Sorry ${message.author} I couldn't mute this user`);
      });
    message.reply(`${member.user.tag} has been muted by ${message.author.tag} because: ${reason}`);
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
    name: "mute",
    category: "Moderation",
    description: "Mute a user",
    usage: "mute @user reason"
  };
  
