exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const invert = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.invert(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "invert.png"));
};
invert();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "invert",
  category: "Canvas",
  description: "An Idiotic invert effect",
  usage: "invert @user"
};
