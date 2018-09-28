exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const bobRoss = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.bobRoss(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "bobRoss.png"));
};
bobRoss();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "bobross",
  category: "Canvas",
  description: "An Idiotic bob ross effect",
  usage: "bobross @user"
};
