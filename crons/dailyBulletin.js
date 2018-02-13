const run = function () {

// https://www.steempunk.net/api/spn/v1/fighters
    const fs      = require('fs');
    const Discord = require('discord.js');
    const logger  = require('winston');
    const auth    = require('../auth.json');
    const steem   = require('steem');

    steem.api.setOptions({
        url: 'https://api.steemit.com'
    });

    logger.info('Check for SPN Bulletin Posts');

    let fileBulletin = __dirname + '/../var/dailyBulletin.js';
    let alreadySent  = fs.readFileSync(fileBulletin, 'utf8');

// send message to discord
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


    steem.api.getDiscussionsByBlog({
        tag  : 'steempunksnet',
        limit: 10
    }, function (err, result) {
        if (!result) {
            return;
        }

        for (let i = 0, len = result.length; i < len; i++) {
            console.log(result[i].permlink);
        }
    });
};

run();

setTimeout(function () {

}, 10000);
//module.exports.run = run;
