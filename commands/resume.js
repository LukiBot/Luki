const Discord = require('discord.js');

exports.run = async (client, message) => {
    const embed = new Discord.MessageEmbed();
    const channel = message.channel;
    const member = message.member;
    const clientMember = message.guild.me;

    if (!member || !member.voiceChannel) {
        embed.setTitle("An error has occurred")
            .setColor('RED')
            .setDescription("You must be in a voice channel to do this!");
        return channel.send(embed);
    }

    if (!clientMember.voiceChannel) {
        embed.setTitle("An error has occurred")
            .setColor('RED')
            .setDescription("I'm not on a voice channel to do that!");
        return channel.send(embed);
    }

    const player = client.playerManager.get(message.guild.id);

    if (!player) {
        embed.setTitle('An error has occurred').setDescription("There is no player on the guild!").setColor("RED");
        return channel.send(embed);
    }

    if (!player.paused) {
        embed.setTitle('An error has occurred').setDescription("The song is not paused to resume it!").setColor("RED");
        return channel.send(embed);
    }

    player.resume();

    embed.setDescription("The song has been resumed!");
    channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Premium"
};

exports.help = {
    name: "resume",
    category: "Music",
    description: "Resume the music",
    usage: "resume"
};