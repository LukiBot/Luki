
module.exports = (client, guild) => {
  client.user.setActivity(`${client.guilds.size} Guilds | Luki.xyz`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
    client.log("log", `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount}`, "JOINED");
};
