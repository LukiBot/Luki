module.exports = (client) => {

 client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  client.log = (type, msg, title) => {
    if (!title) title = "Log";
    console.log(`[${type}] [${title}]${msg}`);
  };

  client.modlog = (serverid, type, mod, badguy, reason, color) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');
    const guild = client.guilds.get(serverid);

    if (!reason) reason = "No reason provided";

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.modlog == "off") return console.log(`Modlog is disabled on ${guild.name}`)
      const embed = new Discord.RichEmbed()
      .setTitle(type + " case")
      .setColor(color)
      .addField("Moderator:", mod, true)
      .addField("User:", badguy, true)
      .addField("Reason:", reason, false)
      const channel = client.channels.get(row.modlog)
      channel.send(embed) 
      });
  };


  client.serverlogMessageEdited = (before, after, author, MSGchannel, MSGid) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("Message Edit")
      .addField("Before:", before, true)
      .addField("After:", after, true)
      .addField("Author:", author, true)
      .addField("Channel:", MSGchannel, true)
      .addField("Message ID:", MSGid, true)
      channel.send(embed)
      });
  };

  client.serverlogMemberJoined = (username, avatar) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("New Member")
      .setThumbnail(avatar)
      .addField("Username:", username, true)
      channel.send(embed)
      });
  };

  client.serverlogMemberLeft = (username, avatar) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("Member Left")
      .setThumbnail(avatar)
      .addField("Username:", username, true)
      channel.send(embed)
      });
  };

  client.serverlogRoleCreated = (rolename) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("Role Created")
      .addField("Role name:", rolename, true)
      channel.send(embed)
      });
  };

  client.serverlogRoleDeleted = (rolename) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("Role Deleted")
      .addField("Role name:", rolename, true)
      channel.send(embed)
      });
  };

  client.serverlogChannelCreated = (channelname) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("Channel Created")
      .addField("Channel name:", rolename, true)
      channel.send(embed)
      });
  };

  client.serverlogChannelDeleted = (channelname) => {
    const sqlite3 = require("sqlite3");
    const Discord = require("discord.js");
    const { RichEmbed } = require("discord.js");
    const db = new sqlite3.Database('./db/servers.db');

    db.get("SELECT * FROM servers WHERE id = ?", [serverid], (err, row) => {
      if (err) return console.log(err.message);
      if (row.serverlog == "off") return console.log(`Serverlog is disabled on ${guild.name}`)
      const channel = client.channels.get(row.serverlog)
      const embed = new Discord.RichEmbed()
      .setTitle("Channel Deleted")
      .addField("Channel name:", rolename, true)
      channel.send(embed)
      });
  };


 client.getGuildSettings = (guild) => {
  const def = client.config.defaultSettings;
  if (!guild) return def;
  const returns = {};
  const overrides = client.settings.get(guild.id) || {};
  for (const key in def) {
    returns[key] = overrides[key] || def[key];
  }
  return returns;
};

  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Loading Command: ${props.help.name}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  client.getSettings = (id) => {
    const defaults = client.settings.get("default");
    let guild = client.settings.get(id);
    if (typeof guild != "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  };
  
  client.writeSettings = (id, newSettings) => {
    const defaults = client.settings.get("default");
    let settings = client.settings.get(id);
    if (typeof settings != "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key])  {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    client.settings.set(id, settings);
  };
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };    

  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  client.wait = require("util").promisify(setTimeout);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);

    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};
