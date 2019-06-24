const constants = require('./constants.js');
const client = constants.client;
const token = constants.token;

require('./commands/commandsMain.js');

client.on('ready', () => {
  console.log(`
  __      __   _          ____        _   
 \ \    / /  (_)        |  _ \      | |  
  \ \  / /__  _  ___ ___| |_) | ___ | |_ 
   \ \/ / _ \| |/ __/ _ \  _ < / _ \| __|
    \  / (_) | | (_|  __/ |_) | (_) | |_ 
     \/ \___/|_|\___\___|____/ \___/ \__|
                                         
										 `);
});

client.login(token);