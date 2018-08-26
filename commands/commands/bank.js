const Discord = require("discord.js")
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database('./database/users.db')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const action = args[0];
  if (!action) return message.channel.send("Please specify an action!")
  if (action.toLowerCase() === "account") {
    db.get(`SELECT * FROM users WHERE id = ?`, [message.author.id], (err, row) => {
      if (err) return console.log(err.message);
      if (!row) {
        db.run(`INSERT INTO users(id) VALUES(?)`, [message.author.id], function(err) {
          if (err) return console.log(err.message);
          console.log(`A row has been inserted with rowid ${this.lastID}`)
      });
      return;
      }
      const embed = new Discord.MessageEmbed()
      .setThumbnail(message.author.avatarURL())
      .setAuthor(`${message.author.tag}'s Bank Account`, message.author.avatarURL())
      .addField('ID', message.author.id)
      .addField('Username:', message.author.tag)
      .addField('Balance:', `$${row.balance}`)
      message.channel.send(embed)
    })
  } else if (action.toLowerCase() === "balance") {
    db.get(`SELECT * FROM users WHERE id = ?`, [message.author.id], (err, row) => {
      if (err) return console.log(err.message);
      if (!row) {
        db.run(`INSERT INTO users(id) VALUES(?)`, [message.author.id], function(err) {
          if (err) return console.log(err.message);
          console.log(`A row has been inserted with rowid ${this.lastID}`)
      });
      return;
      }
      const embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.tag}'s Balance`, message.author.avatarURL())
      .setDescription(`$${row.balance}`)
      message.channel.send(embed)
    })
  } else {
    message.channel.send("Please specify a valid action")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "bank",
  category: "Social",
  description: "The bank system",
  usage: "bank [account/balance]"
};
