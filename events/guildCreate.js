
module.exports = (client, guild) => {
  client.user.setActivity(`${client.guilds.size} Guilds | Luki.xyz`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
    client.log("log", `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount}`, "JOINED");
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
