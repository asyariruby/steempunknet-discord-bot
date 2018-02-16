module.exports = function (bot) {
    "use strict";

    bot.on('guildMemberAdd', function (member) {
        const channel = member.guild.channels.find("name", 'general');

        if (!channel) {
            return;
        }

        let text = `
Welcome to STEEMPUNK-NET ${member}.
The Ultima Corporation is pleased to welcome you.

Like all new fighters you get your starter package in the form of some important links.

Chrome plugin: https://chrome.google.com/webstore/detail/steempunk-net/jifcnginffjgcdcklciiodhaffgfbaph
Firefox addon: https://addons.mozilla.org/de/firefox/addon/steempunk-net/

FAQ: https://www.steempunk.net/FAQ
FAQ for BETA: https://www.steempunk.net/FAQ/Beta-FAQ

Stats: https://www.steempunk.net/SPN/Stats
Fighters: https://www.steempunk.net/SPN/Fighters`;

        channel.send(text);
    });
};
