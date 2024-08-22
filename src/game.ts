import { Grid } from "./grid";
import { Renderer } from "./renderer";
import { Candies } from "./candy";
import { UI } from "./ui";
import { GRIDINFO } from "../types";

export class Game {
<<<<<<< HEAD
	renderer: Renderer;
	grid: Grid;
	gridInfo: GRIDINFO;
	candies: Candies;
	ui: UI;
	moveLimit: number = 4;
	moveCounter: number = 0;
	gameOver: boolean = false;
=======
	renderer: Renderer
	grid: Grid
	gridInfo: GRIDINFO
	candies: Candies
	ui: UI
	moveLimit: number = 100
	moveCounter: number = 0
	gameOver: boolean = false
>>>>>>> dev
	constructor() {
		this.renderer = new Renderer();
		this.grid = new Grid(this.renderer);
		this.candies = new Candies(this.renderer);
		this.ui = new UI(this.renderer);
	}
	async startGame() {
		await Promise.all([
			this.renderer.init(),
			this.ui.init(),
			this.candies.init(),
		]);
		this.gridInfo = await this.grid.makeGrid(8, 8);
		this.ui.createCounterBoard(this.grid.gridPos, this.grid.width);
		this.ui.createLevelBoard(this.grid.gridPos);
		this.gridInfo.forEach((row) => {
			row.forEach((info) => {
				const candy = this.candies.createCandy(info.candyId);
				this.candies.spawn(info.x, info.y, info.cellSize, candy);
				info.candy = candy;
				this.renderer.stage(candy);
			});
		});
		this.grid.gridInfo = this.gridInfo;
		this.candies.setGrid(this.grid, this.ui);
		this.renderer.animationLoop(() => {
			if (!this.gameOver) {
<<<<<<< HEAD
				this.grid.fillCol(this.grid.checkGrid(), this.candies);
				this.moveCounter = this.ui.getMoveCount();
=======
				this.grid.fillCol(this.grid.checkGrid(), this.candies)
				this.moveCounter = this.ui.getMoveCount()
>>>>>>> dev
				if (this.moveCounter >= this.moveLimit) {
					this.gameOver = true;
					this.handleGameOver();
				}
			}
		});
	}

	handleGameOver() {
		this.ui.createGameOverScreen();
		this.candies.setGameOver();
	}
}
