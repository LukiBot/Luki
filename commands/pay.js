const Discord = require("discord.js")

exports.run = async (client, message, args, level) => { 
  const amount = args[1]
  const user1 = message.author
  const user2 = message.mentions.users.first()
  if (!user2) return message.channel.send("Please specify user and amount\n`l.pay @user amount`");
  if (!amount) return message.channel.send("Please specify user and amount\n`l.pay @user amount`");
  if (amount == 0) return message.channel.send("Please specify a larger amount than 1");
  if (amount > 10000) return message.channel.send("Please specify a smaller amount than 10000");
  if (isNaN(amount) || amount.includes(".") || amount.includes("+") || amount.includes("-")) return message.channel.send("Please specify a valid number");
  client.db.get(`SELECT * FROM users WHERE id = ?`, [message.author.id], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) {
      client.db.run(`INSERT INTO users(id) VALUES(?)`, [user1.id], function(err) {
        if (err) return console.log(err.message);
        console.log(`A row has been inserted with rowid ${this.lastID}`)
    });
    return;
    }
    const balance = row.balance;
    if (balance < amount) return message.channel.send("You don't have enough money for that");
    var user1balance = balance - amount;
    client.db.run(`UPDATE users SET balance = ? WHERE id = ?`, [user1balance, user1.id], (err) => {
      if (err) return console.log(err.message);
    })
  })
  client.db.get(`SELECT * FROM users WHERE id = ?`, [user2.id], (err, row) => {
    if (err) return console.log(err.message);
    if (!row) {
      client.db.run(`INSERT INTO users(id) VALUES(?)`, [user2.id], function(err) {
        if (err) return console.log(err.message);
        console.log(`A row has been inserted with rowid ${this.lastID}`)
    });
    return;
    }
    var user2balance = row.balance + amount;
    client.db.run(`UPDATE users SET balance = ? WHERE id = ?`, [user2balance, user2.id], (err) => {
      if (err) return console.log(err.message);
    })
  })
  message.channel.send("Transfer is now completed :ok_hand:")
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "pay",
  category: "Social",
  description: "Transfer money to another user",
  usage: "pay @user amount"
};
