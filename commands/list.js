const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Lists all the audio files the bot has stored.'),
	async execute(interaction, page) {
		var list = "", options = [], items = 0;;

		dbMp3.forEach(async function createItem(item, index) {
	  		options.push(
	  			{
	  				label: `${index+1} - ${item.mp3.replace('.mp3','')} \n`,
	  				// description: `${item.mp3.replace('.mp3','')}`,
	  				value: `${index+1}`,
	  			}
	  		);
		  });

	  	// const row = new MessageActionRow()
	  	// 		.addComponents(
	  	// 			new MessageSelectMenu()
	  	// 				.setCustomId('select')
	  	// 				.setPlaceholder('Click here to play!')
	  	// 				.addOptions(options)
	  	// 		);

	  	const buttonRow = new MessageActionRow()
	  		// .addComponents(
	  		// 	new MessageButton()
	  		// 		.setCustomId('back')
	  		// 		.setLabel(' <-- ')
	  		// 		.setStyle('PRIMARY')
	  		// 		.setDisabled(true),
	  		// )
	  		.addComponents(
	  			new MessageButton()
	  				.setCustomId('intro')
	  				.setLabel(' /intro ')
	  				.setStyle('SECONDARY'),
	  		);
	  		// .addComponents(
	  		// 	new MessageButton()
	  		// 		.setCustomId('forward')
	  		// 		.setLabel(' --> ')
	  		// 		.setStyle('PRIMARY'),
	  		// );

	  		options.forEach(async function makeList(item, index){
	  			list = list + item.label
	  			// if (page) {
	  			// 	count = page*25;
	  			// 	if (index >= count+25 || index <= count-1) return;
	  			// 	list = list + item.label;
	  			// } else {
	  			// 	if (index >= 25) return;
	  			// 	list = list + item.label
	  			// }
	  		})

	  	let response = ":headphones: **Audio List**\n```py\n" + list +"```*Play an audio clip via `/play` command. Or use `/intro` to set it as your intro.\n\nIntro ID of 0 will disable intros, while -1 will disable custom intros.*";

	  	if (page) {
	  		const filter = i => i.customId === 'forward';
			const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

			collector.on('collect', async i => {
				if (i.customId === 'forward') {
					await i.update({ content: response, components: [buttonRow] });
				}
			});

			collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	  	} else {
	  		await interaction.reply({ content: response, components: [buttonRow] });
	  	}
	  	
	},
};