const Discord = require("discord.js")
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database('./database/users.db')

exports.run = async (client, message, args, level) => {
    let newAmount;
    if (!args[0]) return message.channel.send("Please specify the amount of money you want to gamble");
    const amount = args[0];
    if (amount == 0) return message.channel.send("Please specify a larger amount than 1");
    if (amount > 10000) return message.channel.send("Please specify a smaller amount than 10000");
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
        const slots = ['🍇', '🍊', '🍋'];
        const slot1 = slots[Math.floor(Math.random() * slots.length)];
        const slot2 = slots[Math.floor(Math.random() * slots.length)];
        const slot3 = slots[Math.floor(Math.random() * slots.length)];
        const slot4 = slots[Math.floor(Math.random() * slots.length)];
        const slot5 = slots[Math.floor(Math.random() * slots.length)];
        const slot6 = slots[Math.floor(Math.random() * slots.length)];
        const slot7 = slots[Math.floor(Math.random() * slots.length)];
        const slot8 = slots[Math.floor(Math.random() * slots.length)];
        const slot9 = slots[Math.floor(Math.random() * slots.length)];
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Slots Machine")
        embed.setDescription(`| ${slot1} | ${slot2} | ${slot3} |\n---------------------\n| ${slot4} | ${slot5} | ${slot6} |\n---------------------\n| ${slot7} | ${slot8} | ${slot9} |`)
        if (slot4 === slot5 && slot4 === slot6) {
            newAmount = amount * 3;
            db.run(`UPDATE users SET balance = ? WHERE id = ?`, [newAmount, message.author.id], (err) => {
                if (err) {
                    const errEmbed = new Discord.MessageEmbed();
                    errEmbed.setTitle("An error has occurred")
                    errEmbed.setColor('RED');
                    return message.channel.send(errEmbed);
                }
            })
            embed.addField("You won", "$" + newAmount)
        } else if (slot4 === slot5 || slot5 === slot6) {
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
    name: "slots",
    category: "Casino",
    description: "Play a slots game!",
    usage: "slots amount"
};