require('discord.js');
module.exports = {
 getGuildInfo: function (guild) {
  /*
  Returns Object
  */
  let members = guild.members.map(m => m.user.tag); //member tags
  let botCount = guild.members.filter(m => m.user.bot == true).size; //bot count
  let botAccounts = guild.members.filter(m => m.user.bot == true).map(bot => bot.user.tag); // Get bot names
  let userCount = guild.members.size - botCount; //Get human count
  let userAccounts = guild.members.filter(m => m.user.bot == false).map(human => human.user.tag); //Get human names
  let roleCount = guild.roles.size; //Get role amount
  let roleNames = guild.roles.map(role => role.name); //Get role names.
  let created = guild.createdAt; //Get the date which the guild was created at.
  return {
   members: members,
   botUsers: botAccounts,
   botCount: botCount,
   humanCount: userCount,
   humanNames: userAccounts,
   role: {
    names: roleNames,
    amount: roleCount
   },
   created: created
  };
   //End of getGuildInfo(guildCollection)
 },
 kickBots: function (guild, userreason, arr) {
  //WARNING: THIS FUNCTION KICKS ALL BOTS FROM THE GUILD AND THIS ACTION IS IRREVERSIBLE
  let failed = [];
  let success = [];
  let dontKick = arr || [];
  let reason = userreason || 'No reason provided. (Mass Kick)';
  let botAccounts = guild.members.filter(m => m.user.bot == true).map(bot => bot.id); // Array of bot id's.
  botAccounts.forEach(bot => {
   if(dontKick.includes(bot)) continue;
    try {
     await guild.member(bot).kick(reason);
     success.push(bot)
    } catch (error) {
     failed.push(bot);
    }
   });
  return {
   failed: failed,
   kicked: success
  };
  //End of kickBots(guild, reason)
 }
}
