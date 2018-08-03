const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/servers.db');

exports.run = async (client, message, args, level) => {
	if (message.member.permissions.has("MANAGE_GUILD") == true) {
		if (!args[0]) return message.channel.send("Please specify the channel: `o!serverlog #channelName/off`");
		if (message.mentions.channels == null || message.mentions.channels.first() == null) {
			if (args[0].toLowerCase() == "off") {
				db.get(`SELECT serverlog FROM servers WHERE id=? `, [message.guild.id], (err, row) => {
					if (err) return console.log(err.message);
					if(!row) {
						db.run(`INSERT INTO servers(id) values(?)`, [message.guild.id], (err) => {
							console.log("added a server to servers database");
							db.run(`UPDATE servers SET serverlog=? where id=?`, ["off", message.guild.id], (err) => {
								if (err) return console.log(err.message);
								message.channel.send(`Turned the mod log off :ok_hand:`);
							});
						});
					} else {
						db.run(`UPDATE servers SET serverlog=? where id=?`, ["off", message.guild.id], (err) => {
							if (err) return console.log(err.message);
							message.channel.send(`Turned the mod log off :ok_hand:`);
						});
					}
				});
			}
		}
		var channelid = message.mentions.channels.first().id;
		db.get(`SELECT serverlog FROM servers WHERE id=? `, [message.guild.id], (err, row) => {
			if (err) return console.log(err.message);
			if(!row) {
				db.run(`INSERT INTO servers(id) values(?)`, [message.guild.id], (err) => {
					console.log("added a server to servers database");
					db.run(`UPDATE servers SET serverlog=? where id=?`, [`${channelid}`, message.guild.id], (err) => {
						if (err) return console.log(err.message);
						message.channel.send(`Set <#${channelid}> as the mod log :ok_hand:`);
					});
				});
			} else {
				db.run(`UPDATE servers SET serverlog=? where id=?`, [channelid, message.guild.id], (err) => {
					if (err) return console.log(err.message);
					message.channel.send(`Set <#${channelid}> as the mod log :ok_hand:`);
				});
			}
		});
	} else {
		message.channel.send("You don't have enough permissions to use this command!");
	}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "serverlog",
  category: "Server Settings",
  description: "Set the guild's log",
  usage: "serverlog #channelName/off"
};
