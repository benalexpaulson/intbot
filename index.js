const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');

const { prefix, token, dbuser, dbpw, db } = require("./config.json");
const ytdl = require("ytdl-core");

// 
// Commands
// 

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	initDB();
	process.stdout.write('Bot [✔️]');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;
		if (interaction.customId === 'select') {
			console.log(interaction);
			await interaction.update({ content: `played audio clip ${interaction.values[0]}`, components: [] });
		}
});

// 
// Voice
// 

client.on('voiceStateUpdate', (oldState, newState) => {
	const user = {newState, oldState};
	const intro = require('./funcs/intro.js');
  intro(user);
})

client.login(token);

// 
// DB
// 

async function initDB() {
	var mysql = require('mysql');

	var dbclient = mysql.createPool({
	  host: "localhost",
	  user: dbuser,
	  password: dbpw,
	  database: db,
	  charset : "utf8mb4",
	});

	// process.stdout.clearLine();
	process.stdout.write('MP3 DB [✔️]   |   ');

	dbclient.query("SELECT * FROM songs", function (err, result, fields) {
	  if (err) throw err;
	  global.dbMp3 = result;
	});


	dbclient.query("SELECT CAST (did AS CHAR) AS did, nick, intro, show_roll, name, id FROM users", function (err, result, fields) {
	  if (err) throw err;
	  global.dbUser = result;
	});

	process.stdout.write('Users DB [✔️]   |   ');
}

