const run = function () {

// https://www.steempunk.net/api/spn/v1/fighters
    const http    = require('https');
    const fs      = require('fs');
    const Discord = require('discord.js');
    const logger  = require('winston');
    const auth    = require('../auth.json');
    const steem   = require('steem');

    steem.api.setOptions({
        url: 'https://api.steemit.com'
    });

    logger.info('Check for SPN Bulletin Posts');

    const alreadySent = __dirname + '/../var/dailyBulletin.js';

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
