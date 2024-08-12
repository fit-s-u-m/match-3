import { RENDERER, SPRITE, TEXTURE } from "../types";

export class Candies {
	renderer: RENDERER
	candyTextures: TEXTURE[]
	constructor(renderer: RENDERER) {
		this.renderer = renderer
	}
	async init() {
		const candyPaths = [
			'../public/assets/blue.png',
			'assets/green.png',
			'assets/orange.png',
			'assets/red.png',
			'assets/pink.png',
			'assets/yellow.png',
		];
		const promise = candyPaths.map(path => this.renderer.loadAsset(path))
		this.candyTextures = await Promise.all(promise)
	}
	createCandy(candyId: number) {
		return this.renderer.createSprite(this.candyTextures[candyId])
	}
	spawn(x: number, y: number, cellSize: number, candy: SPRITE) {
		candy.position.set(x, 0)
		candy.width = cellSize
		candy.height = cellSize
		this.renderer.animationLoop(this.moveDown.bind(this, candy, y))
	}
	moveDown(candy: SPRITE, y: number) {
		if (candy.y != y) {
			candy.y += 1
		}
	}
}
