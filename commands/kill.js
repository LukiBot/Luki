
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    var owner = 231733082804322304
    let user = message.mentions.users.first();
    if(user.id != owner){
        message.reply('You have killed <@' + user.id + '>!')
    } else
        message.reply("you can't kill him you bastard.")
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "kill",
    category: "Fun",
    description: "kill someone!",
    usage: "kill @user"
};
