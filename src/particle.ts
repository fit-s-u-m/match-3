import { TEXTURE, RENDERER, SPRITE, VECTOR } from "../types.ts"
export class Particle {
	particleTexture: TEXTURE
	renderer: RENDERER
	particle: SPRITE
	velocity: VECTOR;
	life: number;
	fadeSpeed: number;
	position: VECTOR
	alpha: number
	destoyed: boolean = false
	constructor(renderer: RENDERER, position: VECTOR) {
		this.renderer = renderer
		const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
		const speed = Math.random() * 5 + 2; // Random speed
		this.life = 1
		this.fadeSpeed = 0.01
		this.velocity = renderer.createVector(
			Math.cos(angle) * speed,
			Math.sin(angle) * speed
		)
		this.position = renderer.createVector(position.x + this.velocity.x, position.y + this.velocity.y)
	}
	update() {
		if (this.life <= 0.7) {
			this.particle.destroy()
			this.destoyed = true
			return
		}
		this.particle.visible = true
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Decrease life and fade out
		this.life -= this.fadeSpeed;
		this.alpha = Math.max(0, this.life);
		this.particle.alpha = this.alpha;
		this.particle.position.set(this.position.x, this.position.y);
	}
	async init() {
		this.particleTexture = await this.renderer.loadAsset("assets/particle.png")
		this.particle = this.renderer.createSprite(this.particleTexture)
		this.particle.anchor.set(0.5)
		this.particle.setSize(100, 100)

		this.particle.position.set(this.position.x, this.position.y)
		this.particle.zIndex = 1000
		this.particle.visible = false
		this.renderer.stage(this.particle)
	}
}
