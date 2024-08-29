import sound from "pixi-sound";

export class Sound {
	private sounds: { [key: string]: PIXI.sound.Sound } = {};
	private audioContextResumed: boolean = false;

	constructor() {
		this.loadSounds();
		this.handleUserInteraction = this.handleUserInteraction.bind(this);

		document.addEventListener("click", this.handleUserInteraction, {
			once: true,
		});
		document.addEventListener("keydown", this.handleUserInteraction, {
			once: true,
		});
	}

	private handleUserInteraction() {
		if (!this.audioContextResumed) {
			this.audioContextResumed = true;

			this.loadSounds();
		}
	}
	private async loadSounds() {
		const sounds = [
			{ key: "backgroundMusic", path: "/match-3/assets/sounds/music3.mp3" },
			{ key: "game-overMusic", path: "/match-3/assets/sounds/gameove-new.mp3" },
			{ key: "wrongMusic", path: "/match-3/assets/sounds/error.wav" },
			{ key: "swapMusic", path: "/match-3/assets/sounds/newswap.mp3" },
			{ key: "scoreMusic", path: "/match-3/assets/sounds/score increase.mp3" },
			{ key: "buttonClick", path: "/match-3/assets/sounds/select.wav" },
			{ key: "matchMusic", path: "/match-3/assets/sounds/swap.mp3" },
		];
		// Load all sounds
		for (const soundInfo of sounds) {
			this.sounds[soundInfo.key] = sound.add(soundInfo.key, soundInfo.path);
		}
	}

	playSound(key: string) {
		if (this.sounds[key]) {
			this.sounds[key].play();
		} else {
			console.warn(`Sound with key '${key}' not found.`);
		}
	}

	stopSound(key: string) {
		if (this.sounds[key]) {
			this.sounds[key].stop();
		} else {
			console.warn(`Sound with key '${key}' not found.`);
		}
	}
	setVolume(key: string, volume: number) {
		if (this.sounds[key]) {
			this.sounds[key].volume = volume;
		} else {
			console.warn(`Sound with key '${key}' not found.`);
		}
	}
}
