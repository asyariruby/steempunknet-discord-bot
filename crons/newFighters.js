const run = function () {

// https://www.steempunk.net/api/spn/v1/fighters
    const http    = require('https');
    const fs      = require('fs');
    const Discord = require('discord.js');
    const logger  = require('winston');
    const auth    = require('../auth.json');

    logger.info('Check for new fighters...');

    const userFile = __dirname + '/../var/users.js';

    let options = {
        host  : 'www.steempunk.net',
        port  : 443,
        path  : '/api/spn/v1/fighters',
        method: 'GET'
    };

    function arr_diff(a1, a2) {
        let a = [], diff = [];

        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (let k in a) {
            diff.push(k);
        }

        return diff;
    }

    /**
     * Get welcome message
     *
     * @param {String} username
     * @return {string}
     */
    function getMessage(username) {
        let messages = ['Clean up your pocket revolver, sharpen your blades, and prepare for retribution.'];
        let url      = ' We welcome the new fighter. https://steemit.com/@' + username;

        return messages + url;
    }


// Initialize Discord Bot
    function sendMessages(messages) {
        const bot = new Discord.Client();

        bot.on('ready', function (evt) {
            logger.info('Connected');
            logger.info('Logged in as: ');
            logger.info(bot.user.username + ' - (' + bot.user.id + ')');

            const channel = bot.channels.find("name", 'battle-news');

            if (channel) {
                let promises = [];

                for (let i = 0, len = messages.length; i < len; i++) {
                    promises.push(channel.send(messages[i]));
                }

                Promise.all(promises).then(function () {
                    bot.destroy();
                    process.exit();
                });

                return;
            }

            bot.destroy();
            process.exit();
        });

        bot.login(auth.token);
    }

// get new fighters

    http.request(options, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (currentUserData) {
            let oldUserData = fs.readFileSync(userFile, 'utf8');

            if (currentUserData === oldUserData) {
                return;
            }

            let currentUsers = JSON.parse(currentUserData);
            let oldUsers     = JSON.parse(oldUserData);

            let messages = [];
            let newUsers = arr_diff(currentUsers, oldUsers);

            for (let i = 0, len = newUsers.length; i < len; i++) {
                messages.push(getMessage(newUsers[i]));
            }

            sendMessages(messages);

            fs.writeFileSync(userFile, currentUserData);
        });
    }).end();
};

module.exports.run = run;
