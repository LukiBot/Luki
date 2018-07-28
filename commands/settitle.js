const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.db')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  var newtitle = args.slice(0).join(" ");
  if (!args[0]) return message.channel.send("Please specific new title: `o!settitle NEW_TITLE`");
  var userid = message.author.id;
  db.get(`SELECT * FROM users WHERE id =?`, [userid], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) {
      db.run(`INSERT INTO users(id) VALUES(?)`, [userid], function(err) {
        console.log("added users to users database")
        db.run(`UPDATE users SET title = ? WHERE id =?`, [newtitle, userid], function(err) {
          if (err) return console.log(err.message);
          message.channel.send("Done :ok_hand:")
        })
      })
    } else {
      db.run(`UPDATE users SET title = ? WHERE id =?`, [newtitle, userid], function(err) {
        if (err) return console.log(err.message);
        message.channel.send("Done :ok_hand:")
      })
    }
  })
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "settitle",
  category: "User Settings",
  description: "Set your title",
  usage: "settitle NEW_TITLE"
};