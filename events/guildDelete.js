
module.exports = (client, guild) => {
  client.user.setActivity(`${client.guilds.size} Guilds | Luki.xyz`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
    client.settings.delete(guild.id);
    const snekfetch = require('snekfetch');

    const dblkey = '';
     snekfetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set('Authorization', dblkey)
    .send({ server_count: client.guilds.size, 
          shard_count: 2
      })
    .then(() => console.log(`Posted to discordbots.org`))
    .catch((e) => console.error(e));

    const bfdkey = '';
     snekfetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set('Authorization', bfdkey)
    .send({ server_count: client.guilds.size })
    .then(() => console.log(`Posted to botsfordiscord.com`))
    .catch((e) => console.error(e));
};
