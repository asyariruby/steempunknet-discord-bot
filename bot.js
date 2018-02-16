const Discord = require('discord.js');
const logger  = require('winston');
const auth    = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

logger.info('init bot');

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', function (message) {
    if (message.content.indexOf('!8ball') !== -1) {
        require('./commands/8ball.js')(message);
        return;
    }

    if (message.content.indexOf('!troll') !== -1) {
        require('./commands/troll.js')(message);
        return;
    }

    if (message.content.indexOf('!show') !== -1) {
        require('./commands/show.js')(message);
        return;
    }

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) !== '!') {
        return;
    }

    let args = message.content.substring(1).split(' ');
    let cmd  = args[0];

    args = args.splice(1);

    switch (cmd) {
        // !ping
        case 'ping':
            message.channel.send('Pong!');
            break;

        // roll
        case 'roll':
            let limit  = 6;
            let random = Math.floor(Math.random() * (limit + 1));
            message.channel.send('You rolled a ' + random);
            break;
    }
});


// welcome messages for new users
require('./watcher/welcome.js')(bot);
require('./watcher/postpromotion.js')(bot);


// check new fighters
const fighterCheckIntervall = 1000 * 60 * 10;  // every 10 minutes

let checkNewFighters = function () {
    require('./crons/newFighters.js').run();
    setTimeout(checkNewFighters, fighterCheckIntervall);
};

checkNewFighters();


// check daily bulletin
const dailyBulletinCheckInterval = 1000 * 60 * 30;  // every 30 minutes

let checkDailyBulletin = function () {
    require('./crons/dailyBulletin.js').run();
    setTimeout(checkNewFighters, dailyBulletinCheckInterval);
};

checkDailyBulletin();


// bot login to the server
bot.login(auth.token);
