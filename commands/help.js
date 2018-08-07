exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `Use ${message.settings.prefix}help <commandname> for details\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n**${cat}**\n`;
        currentCategory = cat;
      }
      output += `\`${c.help.name}\`, `;
    });
      message.channel.send({embed: {
      description: output,
      footer: {
        icon_url: client.user.avatarURL,
        text: "Luki | Discord bot made by MrSheldon#0001"
      }
    }})
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send({embed: {
        description: `**Name:** ${command.help.name}\n**Description:** ${command.help.description}\n**Usage:** ${command.help.usage}\n**Alias:** ${command.conf.aliases.length === 0 ? "None" : command.conf.aliases.join(", ")}`,
     }})
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp", "commands", "cmds"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "General",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
