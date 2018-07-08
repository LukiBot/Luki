const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    message.channel.send({
        embed: {
            description: `**Mem Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n**Uptime:** ${duration}\n**Users:** ${client.users.size.toLocaleString()}\n**Servers:** ${client.guilds.size.toLocaleString()}\n**Channels:** ${client.channels.size.toLocaleString()}
**Discord.js:** v${version}\n**Node:** ${process.version}`
        }
    });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Information",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
