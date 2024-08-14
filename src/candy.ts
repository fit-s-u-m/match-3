import { Grid } from './grid';
import { GRIDINFO, RENDERER, SPRITE, TEXTURE , GRID,Ui} from "../types";

export class Candies {
	renderer: RENDERER
	candyTextures: TEXTURE[]
	prevPos: { x: number, y: number } = { x: 0, y: 0 }
	private dragTarget: SPRITE | null = null;
	private dragTargetId: number 
	private grid:GRID
	private moveCounter:number = 0
	private ui:Ui
	constructor(renderer: RENDERER) {
		this.renderer = renderer
	}
	async init() {
		const candyPaths = [
			'assets/blue.png',
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
		candy.on('pointerdown', this.startDrag.bind(this, candy,candyId))
		return candy
	}
	startDrag(candy: SPRITE,candyId:number) {
		candy.alpha = 0.75
		this.dragTarget = candy
		this.dragTargetId = candyId
		this.renderer.dragger = this
		this.prevPos = { x: candy.x, y: candy.y }
		this.renderer.app.stage.on('pointermove', this.dragMove.bind(this))
	}
	setGrid(grid:GRID,ui:Ui) {
		this.grid = grid
		this.ui = ui
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
			const notvalid = false //gird.checkvaldity	// TODO: check if the move is valid
			if (notvalid) {
				// return to the previous position
				this.dragTarget.x = this.prevPos.x
				this.dragTarget.y = this.prevPos.y
			}
			else { // swap the candies
				const x = this.dragTarget.position.x
				const y = this.dragTarget.position.y
				let inbound = false
				for (let info of this.grid.gridInfo) {
					const itselfX = this.dragTarget.x == this.prevPos.x
					const itselfY = this.dragTarget.y == this.prevPos.y
					const inXbound = x >= info.x - info.cellSize / 2 && x <= info.x + info.cellSize / 2
					const inYbound = y >= info.y - info.cellSize / 2 && y <= info.y + info.cellSize / 2
					if (inXbound && inYbound && !(itselfX && itselfY)) {
						inbound = true
						this.swap(this.dragTarget, info.candy!)
						const temp = info.candyId
						info.candyId = this.dragTargetId
						this.dragTargetId = temp

						
					}
				}
				if (!inbound) { // reset back to the previous position
					this.dragTarget.x = this.prevPos.x
					this.dragTarget.y = this.prevPos.y
				}
			}
			this.dragTarget = null
		}
		this.renderer.app.stage.off('pointermove', this.dragMove)
	}
	spawn(x: number, y: number, cellSize: number, candy: SPRITE) {
		candy.position.set(x, 0)
		candy.width = cellSize
		candy.height = cellSize
		this.fallDown(candy, y)
		// this.renderer.animationLoop(this.fallDown.bind(this, candy, y))
	}
	swap(candy1: SPRITE, candy2: SPRITE) {
		candy1.x = candy2.x
		candy1.y = candy2.y
		candy2.x = this.prevPos.x
		candy2.y = this.prevPos.y
		this.moveCounter ++
		this.ui.updateMove(this.moveCounter)
	}
	async fallDown(candy: SPRITE, y: number) {
		const speed = 8
		while (candy.y <= y) {
			candy.y += speed
			await this.sleep(10)
		}
	}
	sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}