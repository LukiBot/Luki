const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/users.db')
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.mentions.users.size > 0) {
        var userid = message.mentions.users.first().id
        var username = message.mentions.users.first().username
    } else {
        var userid = message.author.id
        var username = message.author.username
    }
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    let rankLevel;
    if (client.config.ldevelopers.includes(userid) === true) {
        rankLevel = 10;
      } else if (client.config.developers.includes(userid) === true) {
        rankLevel = 9;
      } else if (client.config.managers.includes(userid) === true) {
        rankLevel = 8;
      } else if (client.config.hadmins.includes(userid) === true) {
        rankLevel = 7;
      } else if (client.config.admins.includes(userid) === true) {
        rankLevel = 6;
      } else if (client.config.hmods.includes(userid) === true) {
        rankLevel = 5;
      } else if (client.config.mods.includes(userid) === true) {
        rankLevel = 4
      } else if (client.config.premiump.includes(userid) === true) {
        rankLevel = 3;
      } else if (client.config.premium.includes(userid) === true) {
        rankLevel = 2;
      } else if (client.config.trusted.includes(userid) === true){
        rankLevel = 1;
      } else {
        rankLevel = 0;
      }
    const rank = client.config.permLevels.find(l => l.level === rankLevel).name;

    let badges;
    if (rankLevel === 10) {
        badges = "<:Developer:395238214778224640> <:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 9) {
        badges = "<:Developer:395238214778224640> <:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 8) {
        badges = "<:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 7) {
        badges = "<:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 6) {
        badges = "<:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 5) {
        badges = "<:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 4) {
        badges = "<:Staff:395238244859772929> <:Trusted:395240218506166273>";
    } else if (rankLevel === 3) {
        badges = "<:Donator:395238233103007755> <:Trusted:395240218506166273>";
    } else if (rankLevel === 2) {
        badges = "<:Donator:395238233103007755> <:Trusted:395240218506166273>";
    } else if (rankLevel === 1) {
        badges = "<:Trusted:395240218506166273>";
    } else {
        badges = "";
    }
    db.get(`SELECT * FROM users WHERE id = ?`, [userid], (err, row) => {
        if (err) return console.log(err.message);
        if (!row) {
            db.run(`INSERT INTO users(id) VALUES(?)`, [userid], function(err) {
                if (err) return console.log(err.message);
                console.log(`A row has been inserted with rowid ${this.lastID}`)
            });
            return;
        } else {
            const embed = new Discord.MessageEmbed()
                .setThumbnail(user.avatarURL())
                .setAuthor(`${username}'s Profile`, user.avatarURL())
                .setTitle(badges)
                .setDescription(row.title)
                .addField("Level:", row.level, true)
                .addField("Exp:", row.exp, true)
                .addField("Rank:", rank, true)
                .addField("Bio:", row.bio, false)
            message.channel.send({
                embed
            });
        }
    })
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "profile",
    category: "Social",
    description: "Display yours/someones profile",
    usage: "profile <@user>"
};
