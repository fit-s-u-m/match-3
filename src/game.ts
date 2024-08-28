import { Grid } from "./grid";
import { Renderer } from "./renderer";
import { Candies } from "./candy";
import { UI } from "./ui";
import { GRIDINFO } from "../types";
import { Sound } from "./sound";
import { Particles } from "./particles";
export class Game {
	renderer: Renderer;
	grid: Grid;
	gridInfo: GRIDINFO;
	candies: Candies;
	ui: UI;
	moveCounter: number = 0;
	gameOver: boolean = false;
	private gameOverHandled: boolean = false;
	soundManager = new Sound();
	particles: Particles[] = [];
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

	async startGameLoop() {
		this.gridInfo = await this.grid.makeGrid(8, 8);
		this.ui.createCounterBoard(this.grid.gridPos, this.grid.width);
		this.ui.createScoreBoard(this.grid.gridPos);
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
			this.particles = []
			const matches = this.grid.checkGrid();
			if (this.gameOver) return
			if (matches.length > 0) { // if match
				this.ui.updateScore(matches);
				this.grid.fillCol(matches, this.candies);
			}
			if (this.ui.getMoveCount() == 0 && !this.gameOver) {
				this.gameOver = true;
				this.handleGameOver();
			}
		});
		this.renderer.particleAnimation(() => {
			this.particles.forEach(particle => particle.update())
		})
	}

	handleGameOver() {
		if (this.gameOverHandled) return; // Prevent multiple executions
		this.gameOverHandled = true;

		this.ui.createGameOverScreen();
		this.soundManager.playSound("game-overMusic");
		this.soundManager.setVolume("game-overMusic", 2);
		this.soundManager.stopSound("swapMusic");
		this.soundManager.stopSound("wrongMusic");
		this.soundManager.stopSound("matchMusic");
		this.candies.setGameOver();
	}

}
