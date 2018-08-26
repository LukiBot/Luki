const snek = require('snekfetch');
const Discord = require('discord.js');
const api = "https://api.whatdoestrumpthink.com/api/v1/quotes/random";

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  snek.get(api).then(r => {
    message.channel.send(r.body.message)
})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "trump",
  category: "Fun",
  description: "Trump quotes generator",
  usage: "trump"
};
