const Discord = require("discord.js")
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database('./database/users.db')

exports.run = async (client, message, args, level) => {
    let newAmount;
    if (!args[0]) return message.channel.send("Please specify the amount of money you want to gamble");
    const amount = args[0];
    if (amount == 0) return message.channel.send("Please specify a larger amount than 1");
    if (amount > 500) return message.channel.send("Please specify a smaller amount than 500");
    if (isNaN(amount) || amount.includes(".") || amount.includes("+") || amount.includes("-")) return message.channel.send("Please specify a valid number");
    db.get(`SELECT * FROM users WHERE id = ?`, [message.author.id], (err, row) => {
        if (err) {
            const errEmbed = new Discord.MessageEmbed();
            errEmbed.setTitle("An error has occurred")
            errEmbed.setColor('RED');
            return message.channel.send(errEmbed);
        }
        if (!row) {
            db.run(`INSERT INTO users(id) VALUES(?)`, [message.author.id], function(err) {
                if (err) {
                    const errEmbed = new Discord.MessageEmbed();
                    errEmbed.setTitle("An error has occurred")
                    errEmbed.setColor('RED');
                    return message.channel.send(errEmbed);
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`)
            });
            const errEmbed = new Discord.MessageEmbed();
            errEmbed.setTitle("An error has occurred")
            errEmbed.setColor('RED');
            return message.channel.send(errEmbed);
        }
        if (amount > row.balance) return message.channel.send("You don't have enough money for that!");
        let result = Math.floor((Math.random() * 2));
        const embed = new Discord.MessageEmbed();
        if (result === 1) {
            newAmount = amount * 2;
            db.run(`UPDATE users SET balance = ? WHERE id = ?`, [newAmount, message.author.id], (err) => {
                if (err) {
                    const errEmbed = new Discord.MessageEmbed();
                    errEmbed.setTitle("An error has occurred")
                    errEmbed.setColor('RED');
                    return message.channel.send(errEmbed);
                }
            })
            embed.addField("You won", "$" + newAmount)
        } else {
            newAmount = row.balance - amount;
            db.run(`UPDATE users SET balance = ? WHERE id = ?`, [newAmount, message.author.id], (err) => {
                if (err) {
                    const errEmbed = new Discord.MessageEmbed();
                    errEmbed.setTitle("An error has occurred")
                    errEmbed.setColor('RED');
                    return message.channel.send(errEmbed);
                }
            })
            embed.addField("You lost", "$" + amount)      
      }
        message.channel.send(embed);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "coin",
    category: "Casino",
    description: "Flip a coin!",
    usage: "coin amount"
};