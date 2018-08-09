## Contribute
We love contributors because they make this project even better with their unique talent and skills. If you want to contribute you must know the following this at an intermediate or master level:

- JavaScript (NodeJS v8)
- Discord.JS (v12.0.0-dev#internal-sharding)
- Knowledge of how to use Git

## Steps to Start Contributing
1. To start contributing, firstly create a fork of this project and clone it to your computer, you can read more about it here: [How to Fork a Repo](https://help.github.com/articles/fork-a-repo/)

2. Open a console in the repository where you cloned the repository and run `npm install` to install all the required packages to run the bot.

3. Now you can simply rename `config.js.example` to `config.js` and complete all the details

4. You're now good to go, just run `node index.js` and the bot should boot up.

6. To start adding new code or manipulating existing one just go through different folders and files and edit them, once you're done just push the changes to your forked repository and create a new pull request from GitHub, if the code is sensible and works then it is most likely that it'll be accepted but it's upto the developers to accept or deny your pull request for any reason.

### Useful Resources
[**Discord.js Docs**](https://discord.js.org/#/docs/main/internal-sharding/general/welcome)
[**Discord.js v12.0.0 change-logs**](https://cdn.discordapp.com/attachments/223867697312694272/472138629184225300/screencapture-github-discordjs-discord-js-releases-2018-07-26-16_25_23.png)

### Basic Empty Command Example
```js
exports.run = async (client, message, args, level) => { 
    // code here
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "",
  category: "",
  description: "",
  usage: ""
};
```
