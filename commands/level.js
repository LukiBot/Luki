
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.mentions.users.size > 0) {
    var userid = message.mentions.users.first().id
  } else {
    var userid = message.author.id
  }
  if (message.mentions.users.size > 0) {
    var username = message.mentions.users.first().username
  } else {
    var username = message.author.username
  }
  client.db.get(`SELECT level FROM users WHERE id = ?`, [userid], (err, row) => {
    if (err) {
      return console.error(err.message);
    }

    if (!row){

      client.db.run(`INSERT INTO users(id) VALUES(?)`, [userid], function(err) {
        if (err) {
        return console.log(err.message);
    }
        console.log("added user to levels database")
        client.db.get(`SELECT level FROM users WHERE id =?`, [userid], (err, row2) => {
          if (message.mentions.users.size > 0) {
            message.channel.send(username + " level is " + row2.level);
          } else {
            message.channel.send("Your level is " + row2.level);
          }      
          })
          });
          return;
    } else {
      if (message.mentions.users.size > 0) {
        message.channel.send(username + " level is " + row.level);
      } else {
        message.channel.send("Your level is " + row.level);
      }
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "level",
  category: "Social",
  description: "check your/someone level!",
  usage: "level <@user>"
};
