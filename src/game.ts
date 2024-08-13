import { Grid } from './grid'
import { Renderer } from './renderer'
import { Candies } from './candy'
import { UI } from './ui'
import { GRIDINFO } from '../types'


export class Game {
	renderer: Renderer
	grid: Grid
	gridInfo: GRIDINFO
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
		this.gridInfo = await this.grid.makeGrid(8, 8)
		this.ui.createCounterBoard(this.grid.gridPos, this.grid.width)
		this.ui.createLevelBoard(this.grid.gridPos,)
		this.gridInfo.forEach((info) => {
			const candy = this.candies.createCandy(info.candyId)
			this.candies.spawn(info.x, info.y, info.cellSize, candy)
			info.candy = candy
			this.renderer.stage(candy)
		})
		this.candies.setCandyProp(this.gridInfo)
	}
}
