module.exports = (client, message) => {
  
  if (message.author.bot) return;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/users.db')
const db2 = new sqlite3.Database('./database/servers.db')
var userid = message.author.id;
db.get(`SELECT * FROM users WHERE id = ?`, [userid], (err, row) => {
 if (err) {
    console.log(err.message)
 }
 if (!row) {
    db.run(`INSERT INTO users(exp, id) VALUES(?, ?)`, [1, userid], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
      return;
}
  var exp = row.exp + 1;
  db.run(`UPDATE users SET exp = ? WHERE id = ?`, [exp, userid], function(err) {
    if (err) {
      return console.error(err.message);
    }
    db.get(`SELECT * FROM users WHERE id = ?`, [userid], (err, row2) => {
      if (row2.exp > row2.level * 10) {
        var levelup = row2.level + 1
        db.run(`UPDATE users SET exp = ?, level = ? WHERE id = ?`, [1, levelup, userid], (err) => {
          if (err) return console.log(`Error in MESSAGE event : line 17`)
          var serverid = message.guild.id;
          db2.get(`SELECT * FROM servers WHERE id =?`, [serverid], (err, row3) => {
            if (!row3) {
              db2.run(`INSERT INTO servers(id) VALUES(?)`, [serverid], function(err) {
                  if (err) {
                    return console.log(err.message);
                  }
                  console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
                return;
          }
            if (row3.leveling == 1) {
              message.reply("You are now level " + levelup)
            }
          });
        })
      }
    });
  });
})


 

  if (!message.guild) return;

  const settings = message.settings = client.getGuildSettings(message.guild);

  db2.get(`SELECT * FROM servers WHERE id = ?`, [message.guild.id], (err, row) => {
    if (err) {
       console.log(err.message)
    }
    let prefix;

    if (row) {
      if (row.prefix == null) {
        prefix = 'l.'
      } else {
        prefix = row.prefix; 
    }
    } else {
      prefix = 'l.';
    }

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const level = client.permlevel(message);

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
});
};
