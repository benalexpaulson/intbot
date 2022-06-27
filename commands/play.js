const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a audio clip that the bot has stored.')
		.addUserOption(option => option.setName('user').setDescription('The user')),
	async execute(interaction) {
		// console.log(interaction);
		await interaction.reply(interaction.user.username+' played!');
		intro(interaction, interaction);
	},
};