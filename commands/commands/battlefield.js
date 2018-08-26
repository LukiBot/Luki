const request = require('request-promise-native');

exports.run = async (client, message, args, level) => {
    try {
        let platform;
        let username;
        if(!['pc', 'ps4', 'xone', 'ps3', 'xbox'].includes(args[0])) return message.channel.send('*Please specific platform** `battlefield  pc/xone/ps4/ps3/xbox username`');
        if(!args[1]) return message.channel.send('**Please specific username** `battlefield  pc/xone/ps4/ps3/xbox username`');
        
        platform = args.shift();
        username = args.join(' ');
        
            let options = {
              url: `https://api.bf4stats.com/api/playerInfo?plat=${platform}&name=${username}&output=json`,
              json: true
            };
            let response = await request(options);
        
            message.channel.send({
              embed: {
                author: {
                  name: `${response.player.name}`,
                },
                description: `Played for ${(response.player.timePlayed / 60 / 60).toFixed(2)} hours`,
                fields: [
                  {
                    name: 'Platform',
                    value: `${platform}`,
                    inline: true
                  },
                  {
                    name: 'Rank',
                    value: `${response.player.rank.nr} - ${response.player.rank.name}`,
                    inline: true
                  },
                  {
                    name: 'Score',
                    value: `${response.player.score}`,
                    inline: true
                  },
                  {
                    name: 'Skill',
                    value: `${response.stats.skill}`,
                    inline: true
                  },
                  {
                    name: 'SPM',
                    value: `${(response.stats.extra.spm).toFixed(2)}`,
                    inline: true
                  },
                  {
                    name: 'KPM',
                    value: `${(response.stats.extra.kpm).toFixed(2)}`,
                    inline: true
                  },
                  {
                    name: 'Wins',
                    value: `${response.stats.numWins}`,
                    inline: true
                  },
                  {
                    name: 'Losses',
                    value: `${response.stats.numLosses}`,
                    inline: true
                  },
                  {
                    name: 'W/L',
                    value: `${(response.stats.extra.wlr).toFixed(2)}`,
                    inline: true
                  },
                  {
                    name: 'Kills',
                    value: `${response.stats.kills}`,
                    inline: true
                  },
                  {
                    name: 'Deaths',
                    value: `${response.stats.deaths}`,
                    inline: true
                  },
                  {
                    name: 'K/D',
                    value: `${(response.stats.extra.kdr).toFixed(2)}`,
                    inline: true
                  }
                ],
                thumbnail: {
                  url: 'https://rocketdock.com/images/screenshots/Battlefield4_byWar36.png'
                }
              }
            }).catch(e => {
              console.error(e);
            });
          }
          catch (e) {
            if (e.response) {
              return console.error('error', e.response.statusCode, e.response.statusMessage, message.channel);
            }
            console.error(e);
          }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "battlefield",
    category: "Game Statics",
    description: "Display relevant information about battlefield 4 user",
    usage: "battlefield  pc/xone/ps4/ps3/xbox username"
};