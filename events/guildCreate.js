
module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
  client.user.setActivity(`${client.guilds.size} servers | o!help`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
  const BFD = require("bfd.js");
  const bfd = new BFD('');
  bfd.postStats(client.guilds.size, client.user.id);
};
