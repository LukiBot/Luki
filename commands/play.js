const Discord = require('discord.js');
const prettyMs = require('pretty-ms');

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed();
    const channel = message.channel;
    const member = message.member;

    if (!member || !member.voiceChannel) {
        embed.setTitle("An error has occurred").setColor('RED')
            .setDescription("You must be in a voice channel to do this!");
        return channel.send(embed);
    }

    if (args.length < 1) {
        embed.setTitle("An error has occurred").setColor('RED')
            .setDescription("You must enter what song do you want to play!");
        return channel.send(embed);
    }

    let song = await client.getSongs(args.join(' '));

    if (song.error) {
        embed.setTitle("An error has occurred").setColor('RED').setDescription(song.error);
        return channel.send(embed);
    }

    const queue = client.queue;
    let queueArray = [];

    if (queue.get(message.guild.id)) queueArray = queue.get(message.guild.id);

    if (queueArray.length > 9) {
        embed.setTitle("An error has occurred").setColor('RED')
            .setDescription("There is a limit of 25 songs, you cannot add more until a space is free.");
        return channel.send(embed);
    }

    if (/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(args[0])) {
        const tracksAvailable = await getTracksAvailable(song, true);
        const tracks = tracksAvailable.trackList.tracks[0];
        tracks.requestedBy = member.displayName;

        queueArray.push(tracks);
        queue.set(message.guild.id, queueArray);

        return playSong(tracks, client, message, queueArray, embed);
    }

    const tracksAvailable = await getTracksAvailable(song);

    channel.send(tracksAvailable.embed).then(msg => {
        const filter = m => (!isNaN(m.content) || m.content === 'cancel') && m.author.id === message.author.id;
        channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).then(collected => {
            msg.delete();

            if (collected.first().content === 'cancel') {
                embed.setTitle("").setDescription(`The song selection has been canceled!`);
                return channel.send(embed);
            }

            const chosen = parseInt(collected.first().content);
            const tracks = tracksAvailable.trackList.tracks[chosen - 1];
            tracks.requestedBy = member.displayName;

            queueArray.push(tracks);
            queue.set(message.guild.id, queueArray);

            playSong(tracks, client, message, queueArray, embed);
        }).catch(() => {
            msg.delete();
            embed.setTitle("An error has occurred").setColor('RED').setDescription(`**Time is up! You didn't chose any song.**`);
            channel.send(embed);
        });
    });
};

async function getTracksAvailable(song, isUrl = false) {
    const embed = new Discord.MessageEmbed();
    const tracks = song["tracks"];
    let trackList = {trackList_toString: '', tracks: []};

    for (let i = 0; i < tracks.length; i++) {
        function setTrackListString() {
            let track = tracks[i];
            const duration = prettyMs(track.info.length, {verbose: true});

            trackList.tracks.push(track);
            trackList.trackList_toString += `${trackList.tracks.length}: **${track.info.title}** by *${track.info.author}* - \`${duration}\`\n`;

        }

        await setTrackListString();

        if (i === 4) break;
        if (isUrl) break;
    }

    embed.setTitle('Select a song by saying the number you want in the chat!')
        .setDescription(!trackList.trackList_toString ? "There was an error trying to get a track list, please try again!"
            : trackList.trackList_toString)
        .setFooter('You have 30 seconds to choose');

    return {embed: embed, trackList: trackList};
}

function playSong(song, client, message, queueArray, embed) {
    const channel = message.channel;
    const member = message.member;

    let player = client.playerManager.get(message.guild.id);
    if (!player) player = client.playerManager.join({
        guild: message.guild,
        channel: message.member.voiceChannelID,
        host: 'localhost'
    }, {selfdeaf: true});

    if (queueArray.length === 1) {
        player.play(queueArray[0].track);
        embed.setDescription(`Now Playing:\n**${song.info.title}** requested by *${member.displayName}*`)
            .setThumbnail(`https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`);
        channel.send(embed);
    } else if (queueArray.length > 1) {
        embed.setTitle('Queue List').setDescription(`**${song.info.title}** has been added to the queue`)
            .setThumbnail(`https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg`);
        return channel.send(embed);
    }

    player.once("error", (error) => {
        console.log(error);
        embed.setTitle("An error has occurred").setColor('RED').setDescription(error.error);
        return channel.send(embed);
    });

    player.once("end", data => {
        if (data.reason === "REPLACED") return;
        nextSong(client, message, player);
    });
}

function nextSong(client, message, player) {
    const embed = new Discord.MessageEmbed();
    let queueArray = client.queue.get(message.guild.id);

    queueArray.shift();
    client.queue.set(message.guild.id, queueArray);

    if (queueArray.length >= 1) {
        player.play(queueArray[0].track);
        player.once("end", data => {
            if (data.reason === "REPLACED") return;
            nextSong(client, message, player);
        });

        embed.setDescription(`Now Playing:\n**${queueArray[0].info.title}** requested by *${message.member.displayName}*`)
            .setThumbnail(`https://i.ytimg.com/vi/${queueArray[0].info.identifier}/hqdefault.jpg`);
        message.channel.send(embed);
    } else {
        embed.setTitle('Empty Queue').setDescription(`The queue is empty! There are no more songs to play!`);
        message.channel.send(embed.setThumbnail(""));
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["p"],
    permLevel: "Premium"
};

exports.help = {
    name: "play",
    category: "Music",
    description: "Play a song",
    usage: "play song name | song url"
};