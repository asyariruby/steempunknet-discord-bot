const http  = require('https');
const Table = require('table-layout');

/**
 * Execute a call to the SPN API
 *
 * @param path
 * @return {Promise<any>}
 */
function makeApiCall(path) {
    let options = {
        host  : 'www.steempunk.net',
        port  : 443,
        path  : path,
        method: 'GET'
    };

    return new Promise(function (resolve, reject) {
        http.request(options, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (data) {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).end();
    });
}

/**
 * Parse a fighter list to a table
 *
 * @param {array} result
 * @param {int} limit
 * @return {string}
 */
function parseFightersToTable(result, limit) {
    let fighters = [{
        'username': 'Name',
        'link'    : 'Link'
    }, {
        'username': '',
        'link'    : ''
    }];

    if (typeof limit === 'undefined') {
        limit = result.length;
    }

    for (let i = 0; i < limit; i++) {
        fighters.push({
            username: result[i].username.trim(),
            link    : 'https://steemit.com/@' + result[i].username.trim(),
        });
    }

    let CliTable = new Table(fighters, {
        maxWidth: 200
    });

    return '```' + CliTable.toString() + '```';
}


/**
 * show the top players
 */
function showTop(message) {
    makeApiCall('/api/spn/v1/search/fighters/top').then(function (result) {
        let i, len;
        let text = "";

        text = text + "Top fighters\n";
        text = text + "\n";

        let fighters = [{
            'username': 'Name',
            'link'    : 'Link',
            'level'   : 'Level',
            'exp'     : 'Experience'
        }, {
            'username': '',
            'link'    : '',
            'level'   : '',
            'exp'     : ''
        }];

        for (i = 0, len = 10; i < len; i++) {
            fighters.push({
                username: result[i].username.trim(),
                link    : 'https://steemit.com/@' + result[i].username.trim(),
                level   : parseInt(result[i].level),
                exp     : parseInt(result[i].experience)
            });
        }

        let CliTable = new Table(fighters, {
            maxWidth: 200
        });

        text = text + '```' + CliTable.toString() + '```';

        message.channel.send(text);
    });
}

/**
 * show the top players
 */
function showLevel(message) {
    // find the wanted level
    let str   = message.content;
    let start = str.indexOf('!show level') + ("!show level").length;
    let end   = str.indexOf(' ', start);

    // no space found
    if (end === -1) {
        end = str.length;
    }

    let length = end - start;
    let level  = parseInt(str.substr(start, length));

    if (!level) {
        level = 10;
    }

    makeApiCall('/api/spn/v1/search/fighters/level/' + level).then(function (result) {
        let text = "";

        text = text + "Level " + level + " Fighters\n";
        text = text + "\n";
        text = text + parseFightersToTable(result);

        message.channel.send(text);
    });
}

/**
 * Show the newest fighters
 *
 * @param message
 */
function showNewest(message) {
    makeApiCall('/api/spn/v1/search/fighters/newest').then(function (result) {
        let text = "";

        text = text + "Newest fighters\n";
        text = text + "\n";
        text = text + parseFightersToTable(result);

        message.channel.send(text);
    });
}

/**
 * Show the name of random player
 *
 * @param {Object} message
 */
function showRandomPlayer(message) {
    makeApiCall('/api/spn/v1/fighters').then(function (result) {
        let random = result[Math.floor(Math.random() * result.length)];

        message.channel.send('https://steemit.com/@' + random);
    });
}

// module export
module.exports = function (message) {
    if (message.content.indexOf('!show top') !== -1) {
        showTop(message);
    }

    if (message.content.indexOf('!show level') !== -1) {
        showLevel(message);
    }

    if (message.content.indexOf('!show newest') !== -1) {
        showNewest(message);
    }

    if (message.content.indexOf('!show random') !== -1) {
        showRandomPlayer(message);
    }
};
