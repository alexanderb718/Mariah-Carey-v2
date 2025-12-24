const { VoiceConnectionStatus } = require('@discordjs/voice')

module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	execute: async (oldState, newState) => {
		const client = newState.client;

		if(!newState.channel && !oldState.channel) return;
		if(newState.member?.user?.bot) return;

		if(!newState.channel) {
			const membersInVC = oldState.channel?.members?.filter((m) => !m.user.bot);
			if(membersInVC.size <= 0) {
				client.radio?.leave(oldState.guild, oldState.channel);
			}
			return;
		}
		
		// Check if bot is already in VC
		const hasBot = newState.channel?.members?.has(client.user.id);

		if(!hasBot)
			client.radio.joinChannel(newState.guild, newState.channel);
	}
};