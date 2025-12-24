// https://redstapler.co/javascript-weighted-random/
const weightedRandom = (prob) => {
	let i, sum = 0, r = Math.random();
	for (i in prob) {
		sum += prob[i];
		if (r <= sum) return i;
	}
}

module.exports = {
	weightedRandom
};