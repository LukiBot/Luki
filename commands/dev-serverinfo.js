const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { 
    if (!args[0]) return message.channel.send("Please specify guild ID")
    const guild = client.guilds.find(g => g.id == args[0]);
    if (!guild) return message.channel.send("Please specify a valid guild ID")
    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " day" : " days") + " ago";
    };
    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
    let region = {
        "brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };
    const embed = new Discord.MessageEmbed()
        .setAuthor(guild.name, guild.iconURL())
        .addField("Name", guild.name, true)
        .addField("ID", guild.id, true)
        .addField("Owner", `${guild.owner.user.username}#${guild.owner.user.discriminator}`, true)
        .addField("Region", region[guild.region], true)
        .addField("Total | Humans | Bots", `${guild.members.size} | ${guild.members.filter(member => !member.user.bot).size} | ${guild.members.filter(member => member.user.bot).size}`, true)
        .addField("Verification Level", verifLevels[guild.verificationLevel], true)
        .addField("Channels", guild.channels.size, true)
        .addField("Roles", guild.roles.size, true)
        .addField("Shard ID", guild.shardID, true)
        .addField("MFA Level", guild.mfaLevel, true)
        .addField("Creation Date", `${guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(guild.createdAt)})`, true)
        .setThumbnail(guild.iconURL())
    message.channel.send({embed});
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Developer"
};

exports.help = {
    name: "dev-serverinfo",
    category: "Staff Restricted Commands",
    description: "Display relevant server information for Luki's developers",
    usage: "dev-serverinfo"
};
