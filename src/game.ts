import { Grid } from "./grid";
import { Renderer } from "./renderer";
import { Candies } from "./candy";
import { UI } from "./ui";
import { GRIDINFO } from "../types";
import { Sound } from "./sound";
export class Game {
	renderer: Renderer;
	grid: Grid;
	gridInfo: GRIDINFO;
	candies: Candies;
	ui: UI;
	moveLimit: number = 4;
	moveCounter: number = 0;
	gameOver: boolean = false;
	soundManager = new Sound();
	constructor() {
		this.renderer = new Renderer();
		this.grid = new Grid(this.renderer);
		this.candies = new Candies(this.renderer);
		this.ui = new UI(this.renderer, this);
	}

	async startGame() {
		await Promise.all([
			this.renderer.init(),
			this.ui.init(),
			this.candies.init(),
		]);
		// Create and display the play screen
		this.ui.createplayScreen();
	}

	async startGameLogic() {
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
				this.grid.fillCol(this.grid.checkGrid(), this.candies);
				this.moveCounter = this.ui.getMoveCount();
				if (this.moveCounter >= this.moveLimit) {
					this.gameOver = true;
					this.handleGameOver();
				}
			}
		});
	}

	handleGameOver() {
		this.ui.createGameOverScreen();
		this.soundManager.playSound("game-overMusic");
		this.soundManager.setVolume("game-overMusic", 0.5);
		this.candies.setGameOver();
	}

	// handleplay() {
	// 	this.ui.createplayScreen();
	// 	// this.candies.setGameOver();
	// }
}
