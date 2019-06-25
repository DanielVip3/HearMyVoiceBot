const constants = require('./constants.js');
const client = constants.client;
const token = constants.token;

require('./commands/commandsMain.js');
require('./events/eventsMain.js');

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
  console.log("Bot started and operative. Have fun!")
});

client.login(token);
