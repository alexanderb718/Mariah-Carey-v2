const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js');
const Radio = require('./utils/Radio');
const config = require('./config.json');

const client = new Client({
	presence: {
		status: 'online',
		activities: [
			{
				type: ActivityType.Listening,
				name: 'Mariah Carey - All I Want for Christmas Is You',
			},
		],
	},
	intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
	partials: [],
});

client.commands = new Collection();
client.config = config;
client.radio = new Radio(client);

require('./handlers/Client-Events')(client);