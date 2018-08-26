const Discord = require('discord.js');

exports.run = async (client, message) => {
    const embed = new Discord.MessageEmbed();
    const channel = message.channel;
    const member = message.member;

    if (!member || !member.voiceChannel) {
        embed.setTitle("An error has occurred")
            .setColor('RED')
            .setDescription("You must be in a voice channel to do this!");
        return channel.send(embed);
    }

    const queue = client.queue;
    const queueArray = queue.get(message.guild.id);

    if (!queueArray || queueArray.length < 1) {
        embed.setTitle("An error has occurred")
            .setColor('RED')
            .setDescription("There are no song in the queue!");
        return channel.send(embed);
    }

    const player = client.playerManager.get(message.guild.id);

    if (!player) {
        embed.setTitle('An error has occurred').setDescription("There is no player on the guild!").setColor("RED");
        return channel.send(embed);
    }

    embed.setDescription("Skipping song!");
    channel.send(embed);

    if (queueArray.length === 1) return player.stop();

    queueArray.shift();
    player.play(queueArray[0].track);
    queue.set(message.guild.id, queueArray);

    embed.setDescription(`Now Playing:\n**${queueArray[0].info.title}** requested by *${member.displayName}*`)
        .setThumbnail(`https://i.ytimg.com/vi/${queueArray[0].info.identifier}/hqdefault.jpg`);
    channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "skip",
    category: "Music",
    description: "Skip the song currently playing",
    usage: "skip"
};