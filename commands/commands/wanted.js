exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const wanted = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.wanted(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "wanted.png"));
};
wanted();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "wanted",
  category: "Canvas",
  description: "Create a wanted poster!",
  usage: "wanted @user"
};
