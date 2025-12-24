const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports.commandData = new SlashCommandBuilder()
	.setName('reload-tracks')
	.setDescription('Reloads tracks that are saved to the bot')
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.toJSON();

module.exports.execute = async (client, interaction) => {
	return await client.radio.reloadTracks()
		.then(() => 'Tracks were successfully reloaded')
		.catch((error) => {
			console.error(error);
			return 'Something went wrong, there may be an issue with the tracks.json file, either the file has no listed songs or there is a non-existant song in the file. Message @Hotdog to resolve this.';
		});
}