exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const stepped = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.stepped(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "stepped.png"));
};
stepped();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "shit",
  category: "Canvas",
  description: "An idiotic shit effect",
  usage: "shit @user"
};
