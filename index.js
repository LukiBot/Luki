if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const client = new Discord.Client({ 
  autoReconnect: true,
  shardCount: 1
 });

client.config = require("./config.js");

client.logger = require("./modules/Logger");

require("./modules/functions.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();

client.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

const sql = require('sqlite3');
const serversDB = new sql.Database(process.cwd() + "/database/servers.db")

const init = async () => {

  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });
 
  
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    const mod = require.cache[require.resolve(`./events/${file}`)];
    delete require.cache[require.resolve(`./events/${file}`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
  });

client.on('guildMemberAdd', async (member) => {

  serversDB.get(`SELECT * FROM servers WHERE id = ?`, [member.guild.id], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) return;
    if (row.welcomeLog == null) return;
    if (row.welcomeLog == 'off') return;
    if (row.welcomeMessage == '') return;
    if (row.welcomeMessage == null) return;
    const channel = client.channels.get(row.welcomeLog)
    if (!channel) return;
    const welcomeMessage = row.welcomeMessage
    .replace("{user.name}", member.user.username)
    .replace("{user.mention}", "<@" + member.user.id + ">")
    .replace("{server.name}", member.guild.name);
    channel.send(welcomeMessage)
    if (row.joinRole == null) return;
    if (row.joinRole == 'off') return;
    if (!member.guild.roles.get(row.joinRole)) return;
    member.addRole(row.joinRole).catch(e => console.error("Failed to add role to " + member.user.username + " in guild " + member.guild.name))
  })
})

client.on('guildMemberRemove', async (member) => {

  serversDB.get(`SELECT * FROM servers WHERE id = ?`, [member.guild.id], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) return;
    if (row.welcomeLog == null) return;
    if (row.welcomeLog == 'off') return;
    if (row.leaveMessage == '') return;
    if (row.leaveMessage == null) return;
    const channel = client.channels.get(row.welcomeLog)
    if (!channel) return;
    const leaveMessage = row.leaveMessage
    .replace("{user.name}", member.user.username)
    .replace("{user.mention}", "<@" + member.user.id + ">")
    .replace("{server.name}", member.guild.name);
    channel.send(leaveMessage) 
  })
})
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.on('error', (error) => {
  console.log(error)
  })

  client.on("warn", (e) => console.warn(e));
  client.on("debug", (e) => console.info(e));

  client.login(client.config.token);

};

init();
