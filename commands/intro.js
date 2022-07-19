const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Modal, TextInputComponent, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('intro')
		.setDescription('A Modal to setup your custom intro.'),
	async execute(interaction) {
				const modal = new Modal()
					.setCustomId('introModal')
					.setTitle('Intro Configuration');

				const mp3Id = new TextInputComponent()
					.setCustomId('mp3Id')
					.setLabel("ID of Intro (check /list):")
					.setStyle('SHORT');

				// const botName = new TextInputComponent()
				// 	.setCustomId('botName')
				// 	.setLabel("Name of bot during your intro:")
				// 	.setStyle('SHORT');

		  	// 	const roll = new MessageSelectMenu()
					// .setCustomId('roll')
					// .setPlaceholder('Show roll when intro plays?')
					// .addOptions([{label:'Yes',value:'1'},{label:'No',value:'0'}]);

				const first = new MessageActionRow().addComponents(mp3Id);
				// const second = new MessageActionRow().addComponents(botName);
				// const third = new MessageActionRow().addComponents(roll);
				modal.addComponents(first);
				await interaction.showModal(modal);
		},
};