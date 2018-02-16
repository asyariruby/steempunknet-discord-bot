module.exports = function (bot) {
    "use strict";

    const fs       = require('fs');
    const linkFile = __dirname + '/../var/postpromotions';
    
    bot.on('message', function (message) {
        // react only in the postpromotion chanel
        if (message.channel.name !== 'general-postpromotion') {
            return;
        }

        if (message.content.indexOf('http://') === -1 && message.content.indexOf('https://') === -1) {
            // no link was found
            return;
        }

        let protocol = 'https://';

        if (message.content.indexOf('http://') !== -1) {
            protocol = 'http://';
        }

        // get link from message
        let str   = message.content;
        let start = str.indexOf(protocol);
        let end   = str.indexOf(' ', start);

        // no space found
        if (end === -1) {
            end = str.length;
        }

        let length = end - start;
        let link   = str.substr(start, length);

        // get the last links form postpromotion chanel
        let alreadyPosted = fs.readFileSync(linkFile, 'utf8').split("\n");

        // link is new
        if (alreadyPosted.indexOf(link) === -1) {
            alreadyPosted.push(link);
            fs.writeFileSync(linkFile, alreadyPosted.join("\n"));
            return;
        }

        // was already sent, send reminder and delete
        message.channel.send(
            'This link was already send. Double posting of links is not allowed. ' + message.author
        );

        message.delete();
    });
};
