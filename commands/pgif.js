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
            superagent.get('https://nekobot.xyz/api/image')
            .query({ type: 'pgif'})
            .end((err, response) => {
              message.channel.send({ file: response.body.message });
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
  name: "pgif",
  category: "NSFW",
  description: "it sends porn gif, what were you expected?",
  usage: "pgif"
};
