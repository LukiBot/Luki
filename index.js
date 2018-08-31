if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const {PlayerManager} = require("discord.js-lavalink");
const snekfetch = require('snekfetch');
const fs = require('fs');
const sql = require('sqlite3');
const email = require("emailjs");

const client = new Discord.Client({ 
  autoReconnect: true,
  shardCount: "auto"
 });

client.config = require("./config.js");

client.logger = require("./modules/Logger");

require("./modules/functions.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();
client.queue = new Enmap();

client.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

client.lavaLinkNodes = client.config["lava-link"].nodes;

const serversDB = new sql.Database(process.cwd() + "/database/servers.db")

process.on('SIGINT', () => {
  client.guilds.forEach(guild => {
      if (client.playerManager.get(guild)) client.playerManager.leave(guild);
  });
  process.exit();
});

process.on('SIGHUP', () => process.emit('SIGINT'));
process.on('SIGTERM', () => process.emit('SIGINT'));

client.getSongs = async function getSongs(string) {
  const res = await snekfetch.get(`http://localhost:2333/loadtracks?identifier=ytsearch:${string}`)
      .set("Authorization", "youshallnotpass")
      .catch(err => {
          console.error(err);
          return null;
      });
  if (!res) return {error: "There was an error, try again"};
  if (res.body.length < 1) return {error: "No tracks found"};
  return res.body;
};


class Player extends PlayerManager {
  constructor(client, lavaLinkNodes, param3) {
      super(client, lavaLinkNodes, param3);
  }

  join(data, {selfmute = false, selfdeaf = false} = {}) {
      const player = this.get(data.guild.id);
      if (player) return player;
      this.client.ws.shards[data.guild.shardID].send({
          op: 4,
          d: {
              guild_id: data.guild.id,
              channel_id: data.channel,
              self_mute: selfmute,
              self_deaf: selfdeaf
          }
      });
      return this.spawnPlayer({
          host: data.host,
          guild: data.guild.id,
          channel: data.channel
      });
  }

  leave(guild) {
      this.client.ws.shards[guild.shardID].send({
          op: 4,
          d: {
              guild_id: guild.id,
              channel_id: null,
              self_mute: false,
              self_deaf: false
          }
      });
      const player = this.get(guild.id);
      if (!player) return false;
      player.removeAllListeners();
      player.destroy();
      return this.delete(guild.id);
  }

  async voiceServerUpdate(data) {
      const guild = this.client.guilds.get(data.guild_id);
      if (!guild) return;
      const player = this.get(data.guild_id);
      if (!player) return;
      if (!guild.me) await guild.members.fetch(this.client.user.id).catch(() => null);

      player.connect({
          session: guild.me.voiceSessionID,
          event: data
      });
  }
}

client.on('ready', () => {
  client.playerManager = new Player(client, client.lavaLinkNodes, {
      user: client.user.id
  });
});

client.mailer = email.server.connect({
  user: client.config.mailer.address,
  password: client.config.mailer.password,
  host: client.config.mailer.host,
  ssl: client.config.mailer.ssl
});

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
    .replace("{member.count}", member.guild.memberCount)
    .replace("{server.name}", member.guild.name);
    channel.send(welcomeMessage)
  })
})

client.on('guildMemberAdd', async (member) => {
  serversDB.get(`SELECT * FROM servers WHERE id = ?`, [member.guild.id], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) return;
    if (row.joinRole == null) return;
    if (row.joinRole == 'off') return;
    if (!member.guild.roles.get(row.joinRole)) return;
    member.roles.add(row.joinRole).catch(e => console.error("Failed to add role to " + member.user.username + " in guild " + member.guild.name)) 
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
    .replace("{member.count}", member.guild.memberCount)
    .replace("{server.name}", member.guild.name);
    channel.send(leaveMessage) 
  })
})

// server-log 
client.on('guildMemberAdd', async (member) => {
  serversDB.get("SELECT * FROM servers WHERE id = ?", [member.guild.id], (err, row) => {
    if (!row) return;
    if (err) return console.log(err.message);
    if (row.serverlog == 'off') return;
    if (row.serverlog == null) return;
    const channel = client.channels.get(row.serverlog)
    const embed = new Discord.MessageEmbed()
    .setTitle("Member Joined")
    .setThumbnail(member.user.avatarURL())
    .addField("Username:", member.user.tag, true)
    channel.send(embed)
    });
})
client.on('guildMemberRemove', async (member) => {
  serversDB.get("SELECT * FROM servers WHERE id = ?", [member.guild.id], (err, row) => {
    if (!row) return;
    if (err) return console.log(err.message);
    if (row.serverlog == 'off') return;
    if (row.serverlog == null) return;
    const channel = client.channels.get(row.serverlog)
    const embed = new Discord.MessageEmbed()
    .setTitle("Member Left")
    .setThumbnail(member.user.avatarURL())
    .addField("Username:", member.user.tag, true)
    channel.send(embed)
    });
})

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.on('error', (error) => {
  console.log(error)
  })

  client.login(client.config.token);

};

init();
