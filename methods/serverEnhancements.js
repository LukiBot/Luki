require('discord.js');
exports.function = {
 getGuildInfo: function (guild) {
  /*
  Returns Object
  */
  let members = guild.members.map(m => m.user.tag); //member tags
  let botCount = guild.members.filter(m => m.user.bot == true).size; //bot count
  let botAccounts = guild.members.filter(m => m.user.bot == true).map(bot => bot.user.tag); // Get bot names
  let userCount = guild.members.size - botCount;
  let userAccounts = guild.members.filter(m => m.user.bot == false).map(m => m.user.tag);
  let roleCount = guild.roles.size;
  let roleNames = guild.roles.map(role => role.name);
  let created = guild.createdAt;
  return {
   members: members,
   botUsers: botAccounts,
   botCount: botCount,
   memberCount: userCount,
   memberNames: userAccounts,
   role: {
    names: roleNames,
    amount: roleCount
   } 
  };
   //End of getGuildInfo(guild)
 }
}
