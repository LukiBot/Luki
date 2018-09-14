const sql = require('sqlite3');
const Discord = require("discord.js");

const ticketsDB = new sql.Database(process.cwd() + "/database/tickets.db")

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args[9]) return message.reply("Please add more content to your ticket");
  let content = args.slice().join(" ");
  if (content.length > 1200) return message.reply("Please use less content in your ticket");
  let random = Math.floor((Math.random() * 9999999));
  ticketsDB.run(`INSERT INTO tickets(id, author, content) VALUES(?, ?, ?)`, [random, message.author.tag, content], function(err) {
    if (err) return console.log(err.message);
    const embed = new Discord.MessageEmbed();
    embed.setTitle("A new ticket has been opened");
    message.channel.send(embed);
});
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "openticket",
  category: "General",
  description: "Open a new support ticket",
  usage: "openticket text......"
};
