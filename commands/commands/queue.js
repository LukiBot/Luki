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
        embed.setTitle("An error has occurred").setColor('RED').setDescription("There are no song in the queue!");
        return channel.send(embed);
    }

    let queueList = '';

    queueArray.forEach((value, index) => {
        const duration = prettyMs(value.info.length, {verbose: true});
        if (index === 0) queueList += `${index + 1}: **${value.info.title}** - \`${duration}\`\nRequested by: *${value.requestedBy}* (Now Playing)\n`;
        else queueList += `${index + 1}: **${value.info.title}** - \`${duration}\`\nRequested by: *${value.requestedBy}*\n`;
    });

    embed.setTitle("Queue List").setDescription(queueList);
    channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["q"],
    permLevel: "Premium"
};

exports.help = {
    name: "queue",
    category: "Music",
    description: "Show the queue list",
    usage: "queue"
};