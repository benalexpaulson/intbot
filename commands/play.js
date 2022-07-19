const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a audio clip that the bot has stored.')
		.addIntegerOption(option => option.setName('id')
			.setDescription('Id of the audio clip')
			.setRequired(true)),
	async execute(interaction) {
		let mp3 = interaction.options._hoistedOptions[0].value;
		const intro = require('../funcs/intro.js');

		if (!interaction.member.voice.channelId) {
			await interaction.reply(`:warning: **This command requires you to be in a voice channel!**`);
		} else if (mp3-1 > dbMp3.length) { 
			await interaction.reply(':warning: **Audio file not found!** Check `/list`');
		} else {
			intro(interaction.member, mp3-1);
			await interaction.reply('played ```'+mp3+' - '+dbMp3[mp3-1].mp3+'```');
		}
	},
};