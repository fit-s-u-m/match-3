import { RENDERER, VECTOR } from "../types";
import { Particle } from "./particle";
export class Particles {
	particles: Particle[] = [];
	constructor(renderer: RENDERER, position: VECTOR, num: number) {
		for (let i = 0; i < num; i++) {
			const particle = new Particle(renderer, position);
			this.particles.push(particle);
		}
	}
	update() {
		this.particles.forEach(particle => {
			particle.update();
		});
	}
	async draw() {
		await Promise.all(this.particles.map(particle => particle.init()));
	}
}
