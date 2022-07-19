const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, dbuser, dbpw, db, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

var mysql = require('mysql');

var dbguilds = [];

var dbclient = mysql.createPool({
  host: "localhost",
  user: dbuser,
  password: dbpw,
  database: db,
  charset : "utf8mb4",
});

dbclient.query("SELECT CAST (g_id AS CHAR) g_id FROM guilds", function (err, result, fields) {
  if (err) throw err;
  dbguilds = result;

  dbguilds.forEach(obj => {
  	for (const file of commandFiles) {
  		const filePath = path.join(commandsPath, file);
  		const command = require(filePath);
  		commands.push(command.data.toJSON());
  	}
  	const rest = new REST({ version: '9' }).setToken(token);

  	rest.get(Routes.applicationGuildCommands(clientId, obj.g_id))
  	    .then(data => {
  	        const promises = [];
  	        for (const command of data) {
  	            const deleteUrl = `${Routes.applicationGuildCommands(clientId, obj.g_id)}/${command.id}`;
  	            promises.push(rest.delete(deleteUrl));
  	        }
  	        return Promise.all(promises);
  	    });

  	rest.put(Routes.applicationGuildCommands(clientId, obj.g_id), { body: commands })
  		.then(() => console.log('Successfully registered application commands.'))
  		.catch(console.error);
  });

});
