module.exports = {
	name: 'error',
	once: false,
	execute: async (error) => {
		console.error(error);
	}
};