const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls between 1 - 100 by default')
		.addIntegerOption(option => option.setName('min')
			.setDescription('Minimum Roll'))
		.addIntegerOption(option => option.setName('max')
			.setDescription('Max Roll')),
	async execute(interaction) {
		var min = 1;
		var max = 99;

		if (interaction.options._hoistedOptions[0]) min = interaction.options._hoistedOptions[0].value;
		if (interaction.options._hoistedOptions[1]) max = interaction.options._hoistedOptions[1].value;

		var roll = Math.floor(Math.random() * (max - min + 1) + min);
		await interaction.reply(`**${interaction.user.username}** *rolled a* \`\`${roll}\`\``);
	},
};