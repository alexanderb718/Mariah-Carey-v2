const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	execute: async (interaction) => {
		// Get Client
		const client = interaction.client;

		// Ignore all interactions that aren't slash-commands
		if(interaction.type !== InteractionType.ApplicationCommand) return;

		const { commandName } = interaction;
		const commandObj = client.commands.get(commandName);

		// If the commandObj doesn't have an execute function, then it can't do shit
		if(!commandObj?.execute) return;

		// Execute command and print result
		commandObj.execute(client, interaction)
			.then(response => {
				if(response) {
					// Check if command is deferred or has already been replied to
					if(interaction.deferred || interaction.replied) {
						return interaction.editReply(response);
					}
					else {
						return interaction.reply(response);
					}
				}
				return null;
			})
			.catch(console.error);
	}
};