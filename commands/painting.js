exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const painting = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.painting(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "painting.png"));
};
painting();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "painting",
  category: "Canvas",
  description: "An Idiotic painting effect",
  usage: "painting @user"
};
