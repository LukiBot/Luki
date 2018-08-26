exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const rainbow = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.rainbow(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "wanted.png"));
};
rainbow();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "gay",
  category: "Canvas",
  description: "GAYYYYY!",
  usage: "gay @user"
};
