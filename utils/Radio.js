const { createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus, joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { existsSync } = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

const { weightedRandom } = require('./functions');

class Radio {
	constructor(client) {
		this.client = client;
		this.tracks = {
			filenames: [],
			weights: []
		};
		this.connections = new Collection();

		this.reloadTracks(); // Load filenames and song weights from tracks.json

		this.player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		this.player.on(AudioPlayerStatus.Idle, () => {
			this.playRandomSong();
		});

		this.playRandomSong();
	}

	playRandomSong() {
		const song = createAudioResource(this.getSong());
		this.player.play(song);
	}

	getSong() {
		const index = weightedRandom(this.tracks.weights);

		return this.tracks?.filenames[index] || './mp3-files/og.mp3';
	}

	async leave(guild, channel) {
		if(!this.connections.has(guild.id)) return;

		const connection = this.connections.get(guild.id);
		connection.destroy();
		this.connections.delete(guild.id);
	}

	async joinChannel(guild, channel) {
		if(!guild || !channel) return;

		if(this.connections.has(guild.id)) {
			this.connections.get(guild.id)?.destroy();
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
		});

		connection.on(VoiceConnectionStatus.Ready, async (oldState, newState) => {
			// This is where the fun begins
			const subscription = connection.subscribe(this.player);
		});

		this.connections.set(guild.id, connection);
	}

	reloadTracks() {
		return new Promise(async (resolve, reject) => {
			const tracks = require('../tracks.json');

			if(tracks.length <= 0) {
				reject('No tracks in tracks.json');
			}

			for(const track of tracks) {
				if(!existsSync(path.join(process.cwd(), track.filename))) {
					console.log(path.join(process.cwd(), track.filename));
					reject('Track in tracks.json does not exist, please check the filename and try again');
				}
			}

			this.tracks.filenames = tracks.map(x => x.filename);
			this.tracks.weights = tracks.map(x => x.weight);

			resolve();
		});
	}
};

module.exports = Radio;