
module.exports = (client, before, after) => {
 return console.error('REFUSED TO RUN MESSAGE UPDATE EVENT: Incomplete file');
 if(before.channel.type == 'dm') return; //Dm channel, ignore it.
 else {
  const autoMod = require('../autoMod.js'); //File doesn't exist this file is here for idea purposes until automod is implemented to the repo
  return autoMod(after);
   //check the message content after, and scan it for moderation.
 }
};
/*
  # WARNING THIS FILE WAS CREATED FOR AUTOMOD, THIS FILE IS NOT WORKING PROPERLY AS OF NOW 
 */
