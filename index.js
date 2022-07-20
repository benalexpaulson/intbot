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
	process.stdout.write('Boooot [ \x1b[32m✔️\x1b[89m\x1b[0m ]');
});

client.on('interactionCreate', async interaction => {
	syncDB('refresh');

	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
	}

	if (interaction.isSelectMenu()) {
		if (interaction.customId === 'select') {
			let mp3 = parseInt(interaction.values[0]);

			if (!interaction.member.voice.channelId) {
				await interaction.reply(`:warning: **This command requires you to be in a voice channel!**`);
			} else {
				intro(interaction.member, mp3-2);
				await interaction.reply('played ```'+mp3+' - '+dbMp3[mp3-1].mp3+'```');
			}
		}
	}

	if (interaction.isButton()) {
		var page = 0;
		if (interaction.customId === 'forward') page++;
		if (interaction.customId === 'backward') page--;
		if (interaction.customId === 'intro') {
			client.commands.get('intro').execute(interaction);
			return;
		}

		client.commands.get('list').execute(interaction, page);
	}

	if (interaction.isModalSubmit()) {

		if (interaction.customId === 'introModal') {
			const data = [];

			data['roll'] = 0;
			data['nick'] = '';
			data['intro'] = interaction.fields.getTextInputValue('mp3Id');
			// data['nick'] = interaction.fields.getTextInputValue('botName');
			// const roll = interaction.fields.getSelectMenuValues('roll');
			data['discord'] = interaction.user.id;
			data['name'] = interaction.user.username;
			data['guildId'] = interaction.guild.id;

			// if (!dbUser.includes(data['discord'])) {
			// 	await interaction.reply({ content: 'You do not have permission to enter this command!' });
			// 	return;
			// }

			if (data['intro'] == -1) data['intro'] = 133337;

			if (!dbMp3Ids.includes(parseInt(data['intro']))) {
				await interaction.reply({ content: ':warning: Incorrect ID, check `/list` and try a different intro!' });
				return;
			} else {
				syncDB('update', data);
				await interaction.reply({ content: 'Your settings have been updated!' });
			}
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

async function syncDB(reason, data) {
	var mysql = require('mysql');

	var dbclient = mysql.createPool({
	  host: "localhost",
	  user: dbuser,
	  password: dbpw,
	  database: db,
	  charset : "utf8mb4",
	});

	if (reason == 'update') {
		if (dbUser.includes(data['discord']) && dbUser.includes(data['guildId'])) {
			dbclient.query(`UPDATE users SET intro = ${data['intro']}, nick = '${data['nick']}', show_roll = ${data['roll']} WHERE did = ${data['discord']}`, function (err, result, fields) {
			  if (err) throw err;
			  syncDB('refresh');
			});
		} else {
			dbclient.query(`INSERT INTO users (intro, nick, show_roll, did, name, guild_id) VALUES (${data['intro']}, '${data['nick']}', ${data['roll']}, ${data['discord']}, '${data['name']}' , ${data['guildId']})`, function (err, result, fields) {
			  if (err) throw err;
			  syncDB('refresh');
			});
		}
	}

	// dbclient.query("SELECT * FROM guilds", function (err, result, fields) {
	//   if (err) throw err;
	//   global.dbguilds = result;
	//   global.dbguildIds = dbguilds.map((obj) => obj.id);
	// });

	if (!reason) process.stdout.write('Guilds DB [ \x1b[32m✔️\x1b[89m\x1b[0m ]   |   ');

	dbclient.query("SELECT * FROM songs", function (err, result, fields) {
	  if (err) throw err;
	  global.dbMp3 = result;
	  global.dbMp3Ids = dbMp3.map((obj) => obj.id);
	});

	if (!reason) process.stdout.write('MP3 DB [ \x1b[32m✔️\x1b[89m\x1b[0m ]   |   ');

	dbclient.query("SELECT CAST (did AS CHAR) AS did, nick, intro, show_roll, name, id FROM users", function (err, result, fields) {
	  if (err) throw err;
	  global.dbUser = result;
	});

	if (!reason) process.stdout.write('Users DB [ \x1b[32m✔️\x1b[89m\x1b[0m ]   |   ');
}