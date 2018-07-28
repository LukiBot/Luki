const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.db')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  var newbio = args.slice(0).join(" ");
  if (!args[0]) return message.channel.send("Please specific new bio: `o!setbio NEW_BIO`");
  var userid = message.author.id;
  db.get(`SELECT * FROM users WHERE id =?`, [userid], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) {
      db.run(`INSERT INTO users(id) VALUES(?)`, [userid], function(err) {
        console.log("added users to users database")
        db.run(`UPDATE users SET bio = ? WHERE id =?`, [newbio, userid], function(err) {
          if (err) return console.log(err.message);
          message.channel.send("Done :ok_hand:")
        })
      })
    } else {
      db.run(`UPDATE users SET bio = ? WHERE id =?`, [newbio, userid], function(err) {
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
  name: "setbio",
  category: "User Settings",
  description: "Set your bio",
  usage: "bio NEW_BIO"
};