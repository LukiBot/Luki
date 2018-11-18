
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.channel.nsfw === true) {
    const { get } = require('superagent')
    .get('https://discord.boats/api/bot/luki/voted')
    .query({ id: message.author.id })
    .end((err, res) => {
      var check = res.body.voted;
      if (check == true) {
          const { get } = require('superagent')
 .get('http://api.oboobs.ru/boobs/0/1/random')
 .end((err, res) => {
  message.channel.send(`http://media.oboobs.ru/${res.body[0].preview}`);
 });

        } else {
          message.channel.send({embed: {
            title: "Upvoters-Only Command",
            url: "https://discord.boats/bot/365958655926992896/vote",
            description: "This command is available only for upvoters",
            fields: [{
                name: "Go upvote at",
                value: "https://discord.boats/bot/365958655926992896/vote"
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Status: 403"
            }
          }
          });
        }
    });
    } else {
      message.channel.send({embed: {
          description: "this isn't NSFW channel!"
      }})
    }
};

exports.conf = {
enabled: true,
guildOnly: true,
aliases: [],
permLevel: "User"
};

exports.help = {
name: "boobs",
category: "NSFW",
description: "it sends boobs picture, what were you expected?",
usage: "boobs"
};
