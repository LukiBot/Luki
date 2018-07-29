
module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);


  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }
  client.user.setActivity(`${client.guilds.size} Guilds | o!help`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
  const BFD = require("bfd.js");
  const bfd = new BFD('');
  bfd.postStats(client.guilds.size, client.user.id);
  const snekfetch = require('snekfetch')
  snekfetch.post(`https://discordbots.org/api/bots/463001284329472021/stats`)
    .set('Authorization', '')
    .send({ server_count: client.guilds.size })
    .then(() => console.log('Updated discordbots.org stats.'))
};
