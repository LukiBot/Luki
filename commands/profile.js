const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.db')
const { RichEmbed } = require("discord.js");
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
  db.get(`SELECT * FROM users WHERE id = ?`, [userid], (err, row) => {
    if (err) return console.log (err.message);
    if (!row) {
      db.run(`INSERT INTO users(id) VALUES(?)`, [userid], function(err) {
        if (err) return console.log(err.message);
        console.log("added user to users database")
        db.get(`SELECT * FROM users WHERE id =?`, [userid], (err, row2) => {
          if (err) return console.log(err.message);
          const embed2 = new Discord.RichEmbed()
          .setThumbnail(user.avatarURL)
          .setTitle(`${username}'s Profile`)
          .setDescription(row2.title)
          .addField("Level:", row2.level, true)
          .addField("Exp:", row2.exp, true)
          .addField("Bio:", row2.bio, false)
          message.channel.send({embed2});        
          });
          });
          return;
    } else {
      const embed = new Discord.RichEmbed()
      .setThumbnail(user.avatarURL)
      .setTitle(`${username}'s Profile`)
      .setDescription(row.title)
      .addField("Level:", row.level, true)
      .addField("Exp:", row.exp, true)
      .addField("Bio:", row.bio, false)
      message.channel.send({embed});
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