import { RENDERER, TEXTURE } from "../types";
export class Grid {
	gridImg: TEXTURE
	renderer: RENDERER
	width: number
	height: number
	gridPos: { x: number, y: number }
	constructor(renderer: RENDERER) {
		this.renderer = renderer
	}
	async init() { // load spite for grid
		this.gridImg = await this.renderer.loadAsset("assets/grid1.png");
	}
	async makeGrid(row: number, col: number) { // create grid
		await this.init()
		const grid: { x: number, y: number, cellSize: number, candyId: number }[] = []
		const margin = 10 // to create spacing
		const cellSize = col > row ?
			(this.renderer.app.screen.width - margin * col) / col :
			(this.renderer.app.screen.height - margin * row) / row
		const offset = {
			x: (this.renderer.app.screen.width - (row * cellSize + (row - 1) * margin)) / 2,
			y: (this.renderer.app.screen.height - (col * cellSize + (col - 1) * margin)) / 2
		}
		this.width = col * cellSize + (col - 1) * margin
		this.height = row * cellSize + (row - 1) * margin
		this.gridPos = { x: offset.x, y: offset.y }
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				const cellSprite = this.renderer.createSprite(this.gridImg)
				const x = i * (cellSize + margin) + offset.x
				const y = j * (cellSize + margin) + offset.y
				cellSprite.position.set(x, y)
				cellSprite.width = cellSize
				cellSprite.height = cellSize
				this.renderer.stage(cellSprite)
				const candyId = Math.floor(Math.random() * 6)
				grid.push({ x, y, cellSize, candyId })
			}
		}
		return grid
	}
}
