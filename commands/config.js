const { SlashCommandBuilder } = require('@discordjs/builders');
const { prefix, token, dbuser, dbpw, db, clientId, guild } = require("../config.json");
var mysql = require('mysql');

var dbclient = mysql.createPool({
  host: "localhost",
  user: dbuser,
  password: dbpw,
  database: db,
  charset : "utf8mb4",
});

var customMp3 = [];
dbclient.query("SELECT * FROM songs", function (err, result, fields) {
  if (err) throw err;
  customMp3 = result;
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configure your roles and intro on this server.'),
	async execute(interaction) {
		
		var list = "";
		customMp3.forEach(async function printMp3s(item, index) {
		  var count = index+1;
		  if (list) { 
		  		list = `${list}${count} - ${item.mp3.replace('.mp3','')}\n`;
		  } else {
		  		list = `${count} - ${item.mp3.replace('.mp3','')}\n`;
		  }
		  if (index+1 === customMp3.length) {
		  	await interaction.reply(":headphones: **Audio List**\n```py\n" + list +"\n```*to play type* : `^obi #`");
		  	// await message.channel.send(":headphones: **Audio List**\n```py\n" + list +"\n```*to play type* : `^obi #`");
		  }
		});
	},
};