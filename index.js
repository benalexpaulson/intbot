const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');

const { prefix, token, dbuser, dbpw, db } = require("./config.json");
const ytdl = require("ytdl-core");
const intro = require('./funcs/intro.js');

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
	syncDB();
	process.stdout.write('Bot [ \x1b[32m✔️\x1b[89m\x1b[0m ]');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	syncDB('refresh');
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
			let mp3 = parseInt(interaction.values[0]);

			if (!interaction.member.voice.channelId) {
				await interaction.reply(`:warning: **This command requires you to be in a voice channel!**`);
			} else {
				syncDB('refresh');
				intro(interaction.member, mp3-2);
				await interaction.reply('played ```'+mp3+' - '+dbMp3[mp3-1].mp3+'```');
			}
		}
});

// 
// Voice
// 

client.on('voiceStateUpdate', (oldState, newState) => {
	const user = {newState, oldState};
	syncDB('refresh');
  	intro(user);
})

client.login(token);

// 
// DB
// 

async function syncDB(reason) {
	var mysql = require('mysql');

	var dbclient = mysql.createPool({
	  host: "localhost",
	  user: dbuser,
	  password: dbpw,
	  database: db,
	  charset : "utf8mb4",
	});

	if (reason != 'refresh') process.stdout.write('MP3 DB [ \x1b[32m✔️\x1b[89m\x1b[0m ]   |   ');

	dbclient.query("SELECT * FROM songs", function (err, result, fields) {
	  if (err) throw err;
	  global.dbMp3 = result;
	});


	dbclient.query("SELECT CAST (did AS CHAR) AS did, nick, intro, show_roll, name, id FROM users", function (err, result, fields) {
	  if (err) throw err;
	  global.dbUser = result;
	});

	if (reason != 'refresh') process.stdout.write('Users DB [ \x1b[32m✔️\x1b[89m\x1b[0m ]   |   ');
}

