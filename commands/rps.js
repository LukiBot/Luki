let rps = ["**:moyai: rock**", "**:pencil: paper**", "**:scissors: scissors**"];
function random() { return `${rps[Math.floor(Math.random() * rps.length)]}!` }
exports.run = async (client, msg, args, level) => { // eslint-disable-line no-unused-vars
  let choice = args.join(" ").toLowerCase();
  if (choice === '') return msg.reply("Please specify either rock, paper or scissors.");
  if (choice !== "rock" && choice !== "paper" && choice !== "scissors") return msg.reply(`Please specify either rock, paper or scissors. ${choice} isn't one of those :P`);
  msg.reply(random());
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "rps",
  category: "Fun",
  description: "Nice RPS game with Derpy",
  usage: "rps"
};
