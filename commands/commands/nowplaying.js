const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

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
            .setDescription("There are no songs playing at the moment!");
        return channel.send(embed);
    }

    const song = queueArray[0];
    const duration = prettyMs(song.info.length, {verbose: true});

    embed.setTitle("Currently playing")
        .setDescription(`**${song.info.title}** - \`${duration}\`\nRequested by: *${song.requestedBy}*`)
        .setThumbnail(`https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`);
    channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["nowplaying"],
    permLevel: "Premium"
};

exports.help = {
    name: "np",
    category: "Music",
    description: "See what is currently playing!",
    usage: "np"
};