
module.exports = (client, guild) => {
  client.user.setActivity(`${client.guilds.size} Guilds | o!help`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
    client.settings.delete(guild.id);
};
