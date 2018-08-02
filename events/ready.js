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

  client.user.setActivity(`${client.guilds.size} Guilds | o!help`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/discordapp"
  });
  client.log("log", `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");
};
