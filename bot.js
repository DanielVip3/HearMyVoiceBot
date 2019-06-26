const constants = require('./constants.js');
const client = constants.client;
const token = constants.token;

/* Imports all commands */
require('./commands/commandsMain.js');
/* Imports all events */
require('./events/eventsMain.js');

/* Announces when bot starts */
client.on('ready', () => {
    console.log(`
_    _                 __  __    __      __   _                 ____        _   
| |  | |               |  \\/  |   \\ \\    / /  (_)               |  _ \\      | |  
| |__| | ___  __ _ _ __| \\  / |_   \\ \\  / /__  _  ___ ___ ______| |_) | ___ | |_ 
|  __  |/ _ \\/ _\` | '__| |\\/| | | | \\ \\/ / _ \\| |/ __/ _ \\______|  _ < / _ \\| __|
| |  | |  __/ (_| | |  | |  | | |_| |\\  / (_) | | (_|  __/      | |_) | (_) | |_ 
|_|  |_|\\___|\\__,_|_|  |_|  |_|\\__, | \\/ \\___/|_|\\___\\___|      |____/ \\___/ \\__|
                             __/ |                                            
                            |___/                                                                                 
                                     `);
    console.log("Bot started and operative. Have fun!");

    /* Sets bot's presence */
    client.user.setPresence({
        activity: {
            name: 'v!help',
            type: 'STREAMING'
        },
        status: 'online',
        timestamp: {
            start: Date.now()
        }
    })

});

/* Log-ins with bot's credentials */
client.login(token);
