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

    const queue = client.queue;
    queue.set(message.guild.id, []);

    if (!client.playerManager.get(message.guild.id)) {
        embed.setTitle('An error has occurred').setDescription("There is no player on the guild!").setColor("RED");
        return channel.send(embed);
    }

    client.playerManager.leave(message.guild);

    embed.setDescription("The player has been stopped and the queue has been cleared!");
    channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Premium"
};

exports.help = {
    name: "stop",
    category: "Music",
    description: "Stop the music",
    usage: "stop"
};