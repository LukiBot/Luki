const url = require("url");
const path = require("path");

const Discord = require("discord.js");

const express = require("express");
const app = express();
const moment = require("moment");
require("moment-duration-format");

const passport = require("passport");
const session = require("express-session");
const LevelStore = require("level-session-store")(session);
const Strategy = require("passport-discord").Strategy;
var email = require("emailjs");

const helmet = require("helmet");

const md = require("marked");

const sql = require('sqlite3');
const serversDB = new sql.Database(process.cwd() + "/database/servers.db")
const usersDB = new sql.Database(process.cwd() + "/database/users.db")
const ticketsDB = new sql.Database(process.cwd() + "/database/tickets.db")

module.exports = (client) => {

    const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

    app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });
    passport.use(new Strategy({
            clientID: client.appInfo.id,
            clientSecret: client.config.dashboard.oauthSecret,
            callbackURL: client.config.dashboard.callbackURL,
            scope: ["identify", "guilds", "guilds.join"]
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }));

    app.use(session({
        store: new LevelStore("./data/dashboard-session/"),
        secret: client.config.dashboard.sessionSecret,
        resave: false,
        saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());

    app.locals.domain = client.config.dashboard.domain;

    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");
    var bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }

    const renderTemplate = (res, req, template, data = {}) => {
        const baseData = {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null
        };
        res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    };


    app.get("/login", (req, res, next) => {
            if (req.session.backURL) {
                req.session.backURL = req.session.backURL;
            } else if (req.headers.referer) {
                const parsed = url.parse(req.headers.referer);
                if (parsed.hostname === app.locals.domain) {
                    req.session.backURL = parsed.path;
                }
            } else {
                req.session.backURL = "/";
            }
            next();
        },
        passport.authenticate("discord"));

    app.get("/callback", passport.authenticate("discord", {
        failureRedirect: "/autherror"
    }), (req, res) => {
        addUser(req.user)
        if (req.user.id === client.appInfo.owner.id) {
            req.session.isAdmin = true;
        } else {
            req.session.isAdmin = false;
        }
        if (req.session.backURL) {
            const url = req.session.backURL;
            req.session.backURL = null;
            res.redirect(url);
        } else {
            res.redirect("/");
        }
    });

    app.get("/autherror", (req, res) => {
        renderTemplate(res, req, "autherror.ejs");
    });

    app.get("/logout", function(req, res) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });

    app.get("/", (req, res) => {
        let crmAccess;
        if (req.user) {
            if (client.config.crm.users.includes(req.user.id) === true) {
                crmAccess = true;
            } else {
                crmAccess = false;
            }
        } else {
            crmAccess = false;
        }
        renderTemplate(res, req, "index.ejs", {
            crmAccess
        });
    });

    app.get("/crm/ticket/:ticketID", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            ticketsDB.get(`SELECT * FROM tickets WHERE id = ?`, [req.params.ticketID], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                let ticketID
                let ticketAuthor
                let ticketContent
                if (!row) {
                    ticketID = "undefined",
                        ticketAuthor = "undefined",
                        ticketContent = "undefined"
                } else {
                    ticketID = row.id,
                        ticketAuthor = row.author,
                        ticketContent = row.content
                }
                renderTemplate(res, req, "/crm/ticket.ejs", {
                    ticketID,
                    ticketAuthor,
                    ticketContent
                });

            })
        } else {
            res.redirect("/autherror");
        }
    });

    app.get("/stats", (req, res) => {
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const members = client.guilds.reduce((p, c) => p + c.memberCount, 0);
        const textChannels = client.channels.filter(c => c.type === "text").size;
        const voiceChannels = client.channels.filter(c => c.type === "voice").size;
        const guilds = client.guilds.size;
        renderTemplate(res, req, "stats.ejs", {
            stats: {
                servers: guilds,
                members: members,
                text: textChannels,
                voice: voiceChannels,
                uptime: duration,
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                dVersion: Discord.version,
                nVersion: process.version
            }
        });
    });

    app.get("/dashboard", checkAuth, (req, res) => {
        const perms = Discord.Permissions;
        renderTemplate(res, req, "dashboard.ejs", {
            perms
        });
    });

    app.get("/crm/info", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            renderTemplate(res, req, "/crm/info.ejs", {
                info: {
                    version: client.config.crm.version,
                    edition: client.config.crm.edition
                }
            });
        } else {
            res.redirect(`/autherror`);
        }
    });

    app.get("/crm/tickets", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            ticketsDB.all(`SELECT * FROM tickets`, (err, allTickets) => {
                if (err) {
                    throw err;
                }
                renderTemplate(res, req, '/crm/tickets.ejs', {
                    req,
                    allTickets
                });
            })
        } else {
            res.redirect(`/autherror`);
        }
    });

    app.get("/crm/ticket", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            res.redirect("/crm/tickets")
        } else {
            res.redirect(`/autherror`);
        }
    });

    app.get("/crm/ticket/:ticketID/close", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            ticketsDB.run(`DELETE FROM tickets WHERE id = ?`, [req.params.ticketID], function(err) {
                if (err) {
                    return console.error(err.message);
                }
            });
            res.redirect("/crm/tickets");
        } else {
            res.redirect(`/autherror`);
        }
    });

    app.get("/crm", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            renderTemplate(res, req, "/crm/index.ejs", {});
        } else {
            res.redirect(`/autherror`);
        }
    });

    app.get("/crm/sendmail", checkAuth, (req, res) => {
        if (client.config.crm.users.includes(req.user.id) === true) {
            renderTemplate(res, req, "/crm/sendmail.ejs", {});
        } else {
            res.redirect(`/autherror`);
        }
    });

    app.post("/crm/sendmail", checkAuth, (req, res) => {
        var d = new Date,
            dformat = [d.getMonth() + 1,
                d.getDate(),
                d.getFullYear()
            ].join('/') + ' ' + [d.getHours(),
                d.getMinutes(),
                d.getSeconds()
            ].join(':');
        let mailID = Math.floor((Math.random() * 999999));
        const mailer = email.server.connect({
            user: client.config.mailer.address,
            password: client.config.mailer.password,
            host: client.config.mailer.host,
            ssl: client.config.mailer.ssl
        });
        mailer.send({
            from: client.config.mailer.address,
            subject: req.body.subject,
            to: req.body.to,
            attachment: [{
                data: req.body.content + "<br><br><h4>Mail Information:</h4>Send by: " + req.user.username + "#" + req.user.discriminator + "<br>ID: #" + mailID + "<br>Date: " + dformat + "<br><br>This mail was sent using dCRM " + client.config.crm.version + " - " + client.config.crm.edition + " Edition",
                alternative: true
            }]
        }, function(err, message) {
            console.log(err || message);
        });
        res.redirect("/crm/sendmail");
    });

    app.get("/me", checkAuth, (req, res) => {
        usersDB.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            let rankLevel
            if (client.config.ldevelopers.includes(req.user.id) === true) {
                rankLevel = 10;
            } else if (client.config.developers.includes(req.user.id) === true) {
                rankLevel = 9;
            } else if (client.config.managers.includes(req.user.id) === true) {
                rankLevel = 8;
            } else if (client.config.hadmins.includes(req.user.id) === true) {
                rankLevel = 7;
            } else if (client.config.admins.includes(req.user.id) === true) {
                rankLevel = 6;
            } else if (client.config.hmods.includes(req.user.id) === true) {
                rankLevel = 5;
            } else if (client.config.mods.includes(req.user.id) === true) {
                rankLevel = 4
            } else if (client.config.premiump.includes(req.user.id) === true) {
                rankLevel = 3;
            } else if (client.config.premium.includes(req.user.id) === true) {
                rankLevel = 2;
            } else if (client.config.trusted.includes(req.user.id) === true) {
                rankLevel = 1;
            } else {
                rankLevel = 0;
            }
            const userRank = client.config.permLevels.find(l => l.level === rankLevel).name;
            let userExp
            let userLevel
            let userTitle
            let userBalance
            let userBio
            if (!row) {
                userExp = 1;
                userLevel = 1;
                userBalance = 1;
                userTitle = "No title was found";
                userBio = "No bio was found";
            } else {
                userExp = row.exp
                userLevel = row.level
                userTitle = row.title
                userBio = row.bio
                userBalance = row.balance
            }
            renderTemplate(res, req, "/user/me.ejs", {
                userExp,
                userLevel,
                userTitle,
                userBio,
                userRank,
                userBalance
            });
        })
    });

    app.post("/me", checkAuth, (req, res) => {
        let title = req.body.title;
        let bio = req.body.bio;
        if (!title) title = "No title was found"
        if (!bio) bio = "No bio was found"
        usersDB.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if (!row) {
                usersDB.run(`INSERT INTO users(id, title, bio) VALUES(?, ?, ?)`, [req.user.id, title, bio], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            } else {
                usersDB.run(`UPDATE users SET title = ?, bio = ? WHERE id =? `, [title, bio, req.user.id], function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                });
            }
        });
        res.redirect("/me");
    });

    app.get("/user", (req, res) => {
        res.redirect(`/me`);
    });

    app.get("/user/:userID", (req, res) => {
        const user = client.users.get(req.params.userID);
        if (!user) return res.status(404);
        usersDB.get(`SELECT * FROM users WHERE id = ?`, [req.params.userID], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            let rankLevel
            if (client.config.ldevelopers.includes(req.params.userID) === true) {
                rankLevel = 10;
            } else if (client.config.developers.includes(req.params.userID) === true) {
                rankLevel = 9;
            } else if (client.config.managers.includes(req.params.userID) === true) {
                rankLevel = 8;
            } else if (client.config.hadmins.includes(req.params.userID) === true) {
                rankLevel = 7;
            } else if (client.config.admins.includes(req.params.userID) === true) {
                rankLevel = 6;
            } else if (client.config.hmods.includes(req.params.userID) === true) {
                rankLevel = 5;
            } else if (client.config.mods.includes(req.params.userID) === true) {
                rankLevel = 4
            } else if (client.config.premiump.includes(req.params.userID) === true) {
                rankLevel = 3;
            } else if (client.config.premium.includes(req.params.userID) === true) {
                rankLevel = 2;
            } else if (client.config.trusted.includes(req.params.userID) === true) {
                rankLevel = 1;
            } else {
                rankLevel = 0;
            }
            const userRank = client.config.permLevels.find(l => l.level === rankLevel).name;
            let userExp
            let userLevel
            let userBalance
            let userTitle
            let userBio
            if (!row) {
                userExp = 1;
                userLevel = 1;
                userBalance = 1;
                userTitle = "No title was found";
                userBio = "No bio was found";
            } else {
                userExp = row.exp
                userBalance = row.balance
                userLevel = row.level
                userTitle = row.title
                userBio = row.bio
            }
            var username = user.username
            renderTemplate(res, req, "/user/user.ejs", {
                userExp,
                userLevel,
                userTitle,
                userBio,
                username,
                userRank,
                userBalance
            });
        })
    });

    app.get("/dashboard/:guildID", checkAuth, (req, res) => {
        res.redirect(`/dashboard/${req.params.guildID}/manage`);
    });

    app.get("/leaderboard", (req, res) => {
        renderTemplate(res, req, "leaderboard.ejs");
    });
    app.get("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        serversDB.get(`SELECT * FROM servers WHERE id = ?`, [req.params.guildID], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            let levelValue;
            let modLogChannel;
            let serverLogChannel;
            let welcomeLog;
            let welcomeMessage;
            let leaveMessage;
            let prefix;
            let joinRole;
            if (!row) {
                levelValue = 0;
                modLogChannel = 'off';
                serverLogChannel = 'off';
                welcomeLog = 'off';
                prefix = 'l.';
                welcomeMessage = 'Welcome ${user.name} to {server.name}';
                leaveMessage = '${user.name} has left {server.name}';
                joinRole = 'off';
                serversDB.run(`INSERT INTO servers(id) VALUES(?)`, [req.params.guildID], function(err) {
                    if (err) return console.log(err.message)
                })
            } else {
                if (row.modlog == '') {
                    modLogChannel = 'off'
                } else {
                    modLogChannel = row.modlog
                }
                if (row.serverlog == '') {
                    serverLogChannel = 'off'
                } else {
                    serverLogChannel = row.serverlog
                }
                if (row.welcomeLog == '') {
                    welcomeLog = 'off'
                } else {
                    welcomeLog = row.welcomeLog
                }
                if (row.joinRole == '') {
                    joinRole = 'off'
                } else {
                    joinRole = row.joinRole
                }
                prefix = row.prefix;
                levelValue = row.leveling;
                welcomeMessage = row.welcomeMessage
                leaveMessage = row.leaveMessage
            }

            renderTemplate(res, req, "guild/manage.ejs", {
                guild,
                levelValue,
                modLogChannel,
                serverLogChannel,
                prefix,
                welcomeLog,
                welcomeMessage,
                leaveMessage,
                joinRole
            });
        })
    });

    app.post("/dashboard/:guildID/manage", checkAuth, (req, res) => {
        const guild = client.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) return res.redirect("/");

        let value;

        if (req.body.levels == 'on') {
            value = 1;
        } else {
            value = 0;
        }

        let welcomemessage = req.body.welcomemessage;
        let leavemessage = req.body.leavemessage;
        if (!welcomemessage) welcomemessage = "Welcome ${user.name} to {server.name}"
        if (!leavemessage) leavemessage = "${user.name} has left {server.name}"

        serversDB.get(`SELECT * FROM servers WHERE id = ?`, [req.params.guildID], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if (!row) {
                serversDB.run(`INSERT INTO servers(id, leveling, modlog, serverlog, prefix, welcomeLog, welcomeMessage, leaveMessage, joinRole) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.params.guildID, value, req.body.modlog, req.body.serverlog, req.body.prefix, req.body.welcomelog, welcomemessage, leavemessage.req.body.joinrole], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            } else {
                serversDB.run(`UPDATE servers SET leveling = ?, modlog = ?, serverlog = ?, prefix = ?, welcomeLog = ?, welcomeMessage = ?, leaveMessage = ?, joinRole = ? WHERE id =? `, [value, req.body.modlog, req.body.serverlog, req.body.prefix, req.body.welcomelog, welcomemessage, leavemessage, req.body.joinrole, req.params.guildID], function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                });
            }
        });
        res.redirect("/dashboard/" + req.params.guildID + "/manage");
    });

    app.get("/dashboard/:guildID/leave", checkAuth, async (req, res) => {
        const guild = client.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        await guild.leave();
        res.redirect("/dashboard");
    });

    async function addUser(user) {
        try {
            let accessToken = user.accessToken;
            await client.guilds.get("339085367770611713").addMember(user, {
                accessToken
            });
        } catch (e) {
            console.log("Failed to add user to guild.\n" + e);
        }
    }
    client.site = app.listen(client.config.dashboard.port);
};