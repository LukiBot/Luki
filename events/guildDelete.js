
module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);


  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }
  client.user.setActivity(`${client.guilds.size} servers | o!help`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
};
