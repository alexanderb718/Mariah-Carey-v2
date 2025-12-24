module.exports = {
	name: 'warn',
	once: false,
	execute: async (info) => {
		console.warn(info);
	}
};