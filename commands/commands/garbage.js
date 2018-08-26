exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const garbage = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.garbage(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "garbage.png"));
};
garbage();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "garbage",
  category: "Canvas",
  description: "Oh god, isn't he garbage?!",
  usage: "garbage @user"
};
