const snekfetch = require("snekfetch");

exports.run = (client, message, args, level) => {
  if (!args[0]) return message.channel.send(":x: What do you want to post to Hastebin?");
      snekfetch.post(`https://hastebin.com/documents`)
      .send(args.slice(0).join(" "))
      .then(response => {
      message.channel.send(`:white_check_mark: Posted text to Hastebin at this URL: https://hastebin.com/${response.body.key}`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "hastebin",
  category: "General",
  description: "Upload text to hastebin",
  usage: "hastebin text"
};
