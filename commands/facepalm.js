exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const facepalm = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.facepalm(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "facepalm.png"));
};
facepalm();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "facepalm",
  category: "Canvas",
  description: "An idiotic face palm effect!",
  usage: "facepalm @user"
};
