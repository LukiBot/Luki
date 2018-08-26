exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

const { MessageAttachment } = require("discord.js");
const Idiot = require("idiotic-api");
client.API = new Idiot.Client("", {dev: true});
const beautiful = async () => {
 await message.channel.send(new MessageAttachment(
 await client.API.beautiful(message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
 "beautiful.png"));
};
beautiful();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "beautiful",
  category: "Canvas",
  description: "Oh god, isn't he beautiful?!",
  usage: "beautiful @user"
};
