const Discord = require("discord.js")
const superagent = require("superagent");

exports.run = async (client, msg, args, level) => { 
    if (!args[0]) return msg.channel.send("Please specific role name\n`l.roleinfo ROLE_NAME`")

    var rolename = msg.content.split(" ").slice(1).join(" ");
    let role = msg.guild.roles.find(i => i.name == rolename)

    if(!role) return msg.channel.send("Role wasn't found");
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    };

    const embed = new Discord.MessageEmbed()
        .setColor(role.hexColor)
        .addField('ID', role.id, true)
        .addField('Member count', role.members.size, true)
        .addField('Color', role.hexColor, true)
        .addField('Mentionable', role.mentionable ? '\nYes' : 'No', true)
        .addField('Creation Date', `${role.createdAt.toUTCString().substr(0, 16)} (${checkDays(role.createdAt)})`, true)
    msg.channel.send({embed});
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "roleinfo",
    category: "Information",
    description: "Display relevant role information",
    usage: "roleinfo ROLE_NAME"
};
