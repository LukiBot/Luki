exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    message.channel.send("https://dashboard.luki.xyz");
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "dashboard",
    category: "General",
    description: "Send the dashboard link",
    usage: "dashboard"
  };
  