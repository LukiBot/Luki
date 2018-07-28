const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/serversettings.db')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.member.permissions.has("MANAGE_GUILD") == false) return message.channel.send("You don't have enough permissions to use this command!");
  if (!args[0]) return message.channel.send("Please specific a valid action! `o!levels on/off");
  var serverid = message.guild.id;
  if (args[0] == "on") {
    db.get(`SELECT leveling FROM servers WHERE id =?`, [serverid], (err, row1) => {
      if (!row1) {
        db.run(`INSERT INTO servers(id, leveling) VALUES(?, ?)`, [serverid, 1], function(err) {
          if (err) return console.log(err.message);
        })
      }
    });
    db.run(`UPDATE servers SET leveling = ? WHERE id =?`, [1, serverid], function(err) {
      if (err) return console.log(err.message)  
      message.channel.send("Leveling system is now turning on")
    })
  } else if (args[0] == "off") {
    db.get(`SELECT leveling FROM servers WHERE id =?`, [serverid], (err, row2) => {
      if (!row2) {
        db.run(`INSERT INTO servers(id, leveling) VALUES(?, ?)`, [serverid, 0], function(err) {
          if (err) return console.log(err.message);
        })
      }
    });
    db.run(`UPDATE servers SET leveling = ? WHERE id =?`, [0, serverid], function(err) {
      if (err) return console.log(err.message)
      message.channel.send("Leveling system is now turning off")
    });
  } else {
    message.channel.send("Please specific a valid action! `o!levels on/off")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "levels",
  category: "Server Settings",
  description: "Turns the leveling system on and off",
  usage: "levels on/off"
};