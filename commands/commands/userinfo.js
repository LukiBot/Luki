const { MessageEmbed} = require("discord.js");
const Discord = require("discord.js")
const moment = require("moment");

exports.run = async (client, msg, args, level) => { // eslint-disable-line no-unused-vars
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    };
    let user;
    if (msg.mentions.users.first()) {
      user = msg.mentions.users.first();
    } else {
        user = msg.author;
    }
    const member = msg.guild.member(user);
    const embed = new Discord.MessageEmbed()
    .setThumbnail(user.avatarURL())
    .setTitle(`${user.username}#${user.discriminator}`)
    .addField("ID:", `${user.id}`, true)
    .addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
    .addField("Status:", `${user.presence.status}`, true)
    .addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
    .addField("Created At:", `${user.createdAt.toUTCString().substr(0, 16)} (${checkDays(user.createdAt)})`, false)
    .addField("Joined Server:", `${member.joinedAt.toUTCString().substr(0, 16)} (${checkDays(member.joinedAt)})`, false)
    .addField("Roles:", member.roles.map(roles => `${roles.name}`).join(', '), false)
    msg.channel.send({embed});
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "userinfo",
    category: "Information",
    description: "Display relevant information about the author or mentioned user",
    usage: "userinfo <@user>"
};
