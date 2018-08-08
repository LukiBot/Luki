module.exports = async client => {

  await client.wait(1000);

  client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);

  if (!client.settings.has("default")) {
    if (!client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
    client.settings.set("default", client.config.defaultSettings);
  }


  require("../modules/dashboard")(client);  

  client.log("log", `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");

  
    client.user.setActivity(`${client.guilds.size} Guilds | Luki.xyz`, {
      type: "STREAMING",
      url: "https://www.twitch.tv/discordapp"
    });
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
