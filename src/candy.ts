import { RENDERER, SPRITE, TEXTURE } from "../types";

export class Candies {
	renderer: RENDERER
	candyTextures: TEXTURE[]
	prevPos: { x: number, y: number } = { x: 0, y: 0 }
	private dragTarget: SPRITE | null = null;

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
		const candy = this.renderer.createSprite(this.candyTextures[candyId])
		candy.zIndex = 1
		candy.eventMode = 'static'
		candy.cursor = 'pointer'
		candy.on('pointerdown', this.startDrag.bind(this, candy))
		return candy
	}
	startDrag(candy: SPRITE) {
		candy.alpha = 0.5
		this.dragTarget = candy
		this.renderer.dragger = this
		this.prevPos = { x: candy.x, y: candy.y }
		this.renderer.app.stage.on('pointermove', this.dragMove.bind(this))
	}
	dragMove(event: any) {
		if (this.dragTarget) {
			this.dragTarget.x = event.data.global.x - this.dragTarget.width / 2
			this.dragTarget.y = event.data.global.y - this.dragTarget.height / 2
		}
	}
	dragEnd() {
		if (this.dragTarget) {
			this.dragTarget.alpha = 1
			const notvalid = true // TODO: check if the move is valid
			if (notvalid) {
				// return to the previous position
				this.dragTarget.x = this.prevPos.x
				this.dragTarget.y = this.prevPos.y
			}
			this.dragTarget = null
		}
		this.renderer.app.stage.off('pointermove', this.dragMove)
	}
	spawn(x: number, y: number, cellSize: number, candy: SPRITE) {
		candy.position.set(x, y)
		candy.width = cellSize
		candy.height = cellSize
		// this.fallDown(candy, y)
		// this.renderer.animationLoop(this.fallDown.bind(this, candy, y))
	}
	swap(candy1: SPRITE, candy2: SPRITE) {
		const x1 = candy1.x
		const y1 = candy1.y
		candy1.position.set(candy2.x, candy2.y)
		candy2.position.set(x1, y1)
	}
	fallDown(candy: SPRITE, y: number) {
		const speed = 8
		while (candy.y <= y) {
			candy.y += speed
		}
	}
	sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}
