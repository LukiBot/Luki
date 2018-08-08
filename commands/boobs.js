const superagent = require('superagent')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.channel.nsfw === true) {
        superagent.get('https://discordbots.org/api/bots/365958655926992896/check')
        .set('Authorization', '') 
        .query({ userId: message.author.id })
        .end((err, response) => {
          console.log(response.body.voted);
          var check = response.body.voted;
          if (check == 1) {
            superagent.get('http://api.oboobs.ru/boobs/0/1/random')
            .end((err, response) => {    
              message.channel.send({ file: `http://media.oboobs.ru/${response.body[0].preview}`
             });
            });
          } else {
            message.channel.send({embed: {
              title: "Upvoters-Only Command",
              url: "https://discordbots.org/bot/luki/vote",
              description: "This command is available only for upvoters",
              fields: [{
                  name: "Go upvote at",
                  value: "https://discordbots.org/bot/luki/vote"
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
