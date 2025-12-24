module.exports = {
	name: 'clientReady',
	once: true,
	execute: async (client) => {
		console.log('Proceeding to piss everyone off');

		await require('../Commands')(client);
	}
};