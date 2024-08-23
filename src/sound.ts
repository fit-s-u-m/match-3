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
			{ key: "backgroundMusic", path: "public/assets/sounds/music3.mp3" },
			{ key: "game-overMusic", path: "public/assets/sounds/game-over.wav" },
			{ key: "wrongMusic", path: "public/assets/sounds/error.wav" },
			{ key: "swapMusic", path: "public/assets/sounds/swap.ogg" },
			{ key: "scoreMusic", path: "public/assets/sounds/next-level.wav" },
			{ key: "buttonClick", path: "public/assets/sounds/select.wav" },
			{ key: "matchMusic", path: "public/assets/sounds/match.wav" },
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
