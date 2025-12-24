const { readdirSync } = require('fs');
const path = require('path');

module.exports = (client) => {
	client.login(process.env.TOKEN); // Login with token from .env file

	const eventPath = path.join(__dirname, 'client-events')
	const eventFiles = readdirSync(eventPath).filter(file => file.endsWith('.js'));

	for(const file of eventFiles) {
		const filePath = path.join(eventPath, file);
		const event = require(filePath);
		if(event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
};