const run = function () {
    "use strict";

    const fs      = require('fs');
    const Discord = require('discord.js');
    const logger  = require('winston');
    const auth    = require('../auth.json');
    const steem   = require('steem');

    steem.api.setOptions({
        url: 'https://api.steemit.com'
    });

    logger.info('Check for SPN Bulletin Posts');

    /**
     * Send messages to discord
     *
     * @param {array} messages - list of messages
     */
    function sendMessages(messages) {
        const bot = new Discord.Client();

        bot.on('ready', function (evt) {
            logger.info('Connected');
            logger.info('Logged in Bulletin');
            logger.info(bot.user.username + ' - (' + bot.user.id + ')');

            const channel = bot.channels.find("name", 'battle-news');

            if (channel) {
                let promises = [];

                for (let i = 0, len = messages.length; i < len; i++) {
                    promises.push(channel.send(messages[i]));
                }

                Promise.all(promises).then(function () {
                    bot.destroy();
                });

                return;
            }

            bot.destroy();
            process.exit();
        });

        bot.login(auth.token);
    }

    /**
     * get the newest posts from steempunksnet
     *
     * @type {string}
     */
    let bulletinFile = __dirname + '/../var/dailyBulletin.js';
    let alreadySent  = fs.readFileSync(bulletinFile, 'utf8').split("\n");

    steem.api.getDiscussionsByBlog({
        tag  : 'steempunksnet',
        limit: 10
    }, function (err, result) {
        if (!result) {
            return;
        }

        let i, len, permlink;
        let missing = [];

        for (i = 0, len = result.length; i < len; i++) {
            permlink = result[i].permlink;

            if (alreadySent.indexOf(permlink) !== -1) {
                continue;
            }

            alreadySent.push(permlink);

            missing.push(
                "https://steemit.com/" + result[i].category + '/@' + result[i].author + '/' + permlink
            );
        }

        // send link to the discord
        if (missing.length) {
            sendMessages(missing);
        }

        fs.writeFileSync(bulletinFile, alreadySent.join("\n"));
    });
};

module.exports.run = run;
