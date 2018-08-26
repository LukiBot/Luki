exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const tattoo = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.tattoo(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "tattoo.png"));
};
tattoo();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "tattoo",
  category: "Canvas",
  description: "Idiotic tattoo effect",
  usage: "tattoo @user"
};
