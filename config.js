const config = {
  "ldevelopers": [],
  "developers": [],
  "managers": [],
  "hadmins": [],
  "admins": [],
  "hmods": [],
  "mods": [],
  "premiump": [],
  "premium": [],
  "trusted": [],

  "token": "",

  "dashboard" : {
    "oauthSecret": "",
    "callbackURL": "http://localhost:80/callback",
    "sessionSecret": "duaufgayfga6gfhabfahbfhabgh",
    "domain": "http://localhost:80/",
    "port": 80
  },

  "defaultSettings" : {
    "prefix": "o!",
  },

  permLevels: [
    { level: 0,
      name: "User", 
      check: () => true
    },
    { level: 1,
      name: "Trusted", 
      check: (message) => config.trusted.includes(message.author.id)
    },
    { level: 2,
      name: "Premium", 
      check: (message) => config.premium.includes(message.author.id)
    },
    { level: 3,
      name: "Premium+", 
      check: (message) => config.premiump.includes(message.author.id)
    },
    { level: 4,
      name: "Moderator", 
      check: (message) => config.mods.includes(message.author.id)
    },
    { level: 5,
      name: "Head Moderator", 
      check: (message) => config.hmods.includes(message.author.id)
    },
    { level: 5,
      name: "Head Moderator", 
      check: (message) => config.hmods.includes(message.author.id)
    },
    { level: 6,
      name: "Adminsitrator", 
      check: (message) => config.admins.includes(message.author.id)
    },
    { level: 7,
      name: "Head Administrator", 
      check: (message) => config.hadmins.includes(message.author.id)
    },

    { level: 8,
      name: "Manager",
      check: (message) => config.managers.includes(message.author.id)
    },

    { level: 9,
      name: "Developer",
      check: (message) => config.developers.includes(message.author.id)
    },

    { level: 10,
      name: "Lead Developer", 
      check: (message) => config.ldevelopers.includes(message.author.id)
    }
  ]
};

module.exports = config;
