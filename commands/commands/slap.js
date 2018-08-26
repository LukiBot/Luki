exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const { MessageAttachment } = require("discord.js");
  const Idiot = require("idiotic-api");
  client.API = new Idiot.Client("", {dev: true});

  const batSlap = async () => {
   await message.channel.send(new MessageAttachment(
   await client.API.batSlap(message.author.displayAvatarURL({ format: "png", size: 128 }),
   message.mentions.users.first().displayAvatarURL({ format: "png", size: 128 })),
   "batslap.png"));
  };
  batSlap();
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "slap",
  category: "Canvas",
  description: "slap someone!",
  usage: "slap @user"
};
