import { Grid } from './grid'
import { Renderer } from './renderer'
import { Candies } from './candy'
import { UI } from './ui'


export class Game {
	renderer: Renderer
	grid: Grid
	gridCoord: { x: number, y: number, cellSize: number }[]
	candies: Candies
	ui: UI
	constructor() {
		this.renderer = new Renderer()
		this.grid = new Grid(this.renderer)
		this.candies = new Candies(this.renderer)
		this.ui = new UI(this.renderer)
	}
	async startGame() {
		await Promise.all([this.renderer.init(), this.ui.init(), this.candies.init()])
		this.gridCoord = await this.grid.makeGrid(8, 8)
		this.ui.createCounterBoard(this.grid.gridPos, this.grid.width)
		this.ui.createLevelBoard(this.grid.gridPos)
		this.gridCoord.forEach((coord) => {
			const candy = this.candies.createCandy(Math.floor(Math.random() * 6))
			this.candies.spawn(coord.x, coord.y, coord.cellSize, candy)
			this.renderer.stage(candy)
		})
	}
}
