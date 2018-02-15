const http = require('https');

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
 * show the top players
 */
function showTop(message) {
    makeApiCall('/api/spn/v1/search/fighters/top').then(function (result) {
        let i, len, username, level, xp;
        let text = "";

        text = text + "Top fighters\n";
        text = text + "=====================\n\n";

        for (i = 0, len = result.length; i < len; i++) {
            username = result[i].username;
            level    = result[i].level;
            xp       = result[i].experience;

            text = text + '- ' + username + ' - <https://steemit.com/@' + username + '>';
            text = text + ' - Level: ' + level;
            text = text + ' - Experience: ' + xp;
            text = text + "\n";
        }

        message.channel.send(text);
    });
}

/**
 * show the top players
 */
function showLevel(message) {

}

function showNewest(message) {
    makeApiCall('/api/spn/v1/search/fighters/newest').then(function (result) {
        let i, len, username;
        let text = "";

        text = text + "Newest fighters\n";
        text = text + "=====================\n\n";

        for (i = 0, len = result.length; i < len; i++) {
            username = result[i].username;
            text     = text + '- ' + username + ' - <https://steemit.com/@' + username + ">\n";
        }

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
    //message.channel.send();
};
