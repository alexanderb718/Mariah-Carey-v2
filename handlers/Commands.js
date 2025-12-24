const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const ascii = require('ascii-table');
const table = new ascii('Commands');
table.setHeading('Command', ' Load Status');
const path = require('path');
const { readdirSync } = require('fs');

module.exports = async (client) => {
	const commandPath = path.join(process.cwd(), 'commands');
	const slashCommands = readdirSync(commandPath).filter(file => file.endsWith('.js'));

	const slashCommandArray = [];
	slashCommands.map((value) => {
		const filePath = path.join(commandPath, value);
		const file = require(filePath);

		if(!file?.commandData?.name) {
			table.addRow(value, '✖ (Did you forget to add a name attribute?)');
		}
		else {
			client.commands.set(file.commandData?.name, file);
			table.addRow(file.commandData?.name, '✅');

			slashCommandArray.push(file.commandData);
		}
	});

	const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

	(async () => {
		try {
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: slashCommandArray })
			console.log(table.toString());
		}
		catch(error) {
			console.error(error);
		}
	})();
};