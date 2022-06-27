const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Lists all the audio files the bot has stored.'),
	async execute(interaction) {
		
		var list = "", options = [];

		dbMp3.forEach(async function printMp3s(item, index) {
		  var count = index+1;

			  if (count <= 25) {
		  	  list = `${list}${count} - ${item.mp3.replace('.mp3','')}\n`;
		  		options.push(
		  			{
		  				label: `${count}`,
		  				description: `${item.mp3.replace('.mp3','')}`,
		  				value: `${count}`,
		  			}
		  		);
			  }
		  });

	  	const row = new MessageActionRow()
	  			.addComponents(
	  				new MessageSelectMenu()
	  					.setCustomId('select')
	  					.setPlaceholder('Click here to play!')
	  					.addOptions(options)
	  			);

  		await interaction.reply({ content: ":headphones: **Audio List**\n```py\n" + list +"```", components: [row] });
	},
};