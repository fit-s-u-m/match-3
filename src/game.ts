import { Grid } from './grid'
import { Renderer } from './renderer'
import { Candies } from './candy'

export class Game {
	renderer: Renderer
	grid: Grid
	gridCoord: { x: number, y: number, cellSize: number }[]
	candies: Candies
	constructor() {
		this.renderer = new Renderer()
		this.grid = new Grid(this.renderer)
		this.candies = new Candies(this.renderer)
		// this.gridCoord = grid
	}
	async startGame() {
		await this.renderer.init()
		this.gridCoord = await this.grid.makeGrid(8, 8)
		await this.candies.init()
		// await Promise.all([this.grid.makeGrid(6, 6), this.candies.init()])
		this.gridCoord.forEach((coord) => {
			const candy = this.candies.createCandy(Math.floor(Math.random() * 6))
			this.candies.spawn(coord.x, coord.y, coord.cellSize, candy)
			this.renderer.stage(candy)
		})
	}
}
