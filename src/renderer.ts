import * as PIXI from "pixi.js"

import { ELEMENT } from "../types.ts"

export class Renderer {
	app: PIXI.Application
	dragger: any
	gameOverBackgroundTexture: PIXI.Texture | null = null;
	restartTexture: PIXI.Texture | null = null;
	restartIcon: PIXI.Sprite | null = null;
	constructor() {
		this.app = new PIXI.Application()

	}
	async init() {
		await this.app.init({
			width: window.innerWidth,
			height: window.innerHeight
		});
		this.app.stage.eventMode = 'static';
		this.app.stage.hitArea = this.app.screen;
		this.app.stage.on('pointerup', () => {
			if (this.dragger)
				this.dragger.dragEnd()
		});
		this.app.stage.on('pointerupoutside', () => {
			if (this.dragger)
				this.dragger.dragEnd()
		});

		document.body.appendChild(this.app.canvas);

		// setting the background
		const bgPath = "../public/assets/bg5-2.jpg"
		const backgroundTexture = await PIXI.Assets.load(bgPath);
		const backgroundSprite = new PIXI.Sprite(backgroundTexture);
		backgroundSprite.zIndex = -10
		backgroundSprite.width = this.app.screen.width
		backgroundSprite.height = this.app.screen.height
		this.stage(backgroundSprite)

		this.gameOverBackgroundTexture = await PIXI.Assets.load("public/assets/level1.png");
		this.restartTexture = await PIXI.Assets.load("public/assets/restart.png");
	}
	stage(...element: ELEMENT[]) {
		element.forEach(element => this.app.stage.addChild(element))
	}
	getMid() {
		return { x: this.app.screen.width / 2, y: this.app.screen.height / 2 }
	}
	async loadAsset(path: string) {
		return await PIXI.Assets.load(path)
	}
	createSprite(texture: any) {
		return new PIXI.Sprite(texture)
	}
	async animationLoop(callback: Function) {
		this.app.ticker.autoStart = false
		let elapsedData = 0;
		this.app.ticker.add(delta => {
			elapsedData += delta.deltaMS
			if (elapsedData > 700) {
				callback()
				elapsedData = 0
			}
		})
	}
	sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
	removeLoop(callback: Function) {
		this.app.ticker.remove(() => { callback() })
	}
	write(text: string, x: number, y: number) {
		const style = new PIXI.TextStyle({
			fill: "white",
			fontSize: 40,
			fontFamily: "Arial",
			align: "center",
			fontWeight: "bold"
		})
		const textSprite = new PIXI.Text({ text, style })
		textSprite.anchor.set(0.5)
		textSprite.position.set(x, y)
		return textSprite
	}
	displayGameOver() {
		const gameOverBackground = new PIXI.Sprite(this.gameOverBackgroundTexture!);
		gameOverBackground.anchor.set(0.5);
		gameOverBackground.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
		gameOverBackground.width = 600;
		gameOverBackground.height = 100;
		gameOverBackground.zIndex = 10;

		const gameOverText = new PIXI.Text('Game Over', {
			fontSize: 80,
			fill: 'white',
			fontWeight: 'bold'
		});
		gameOverText.anchor.set(0.5);
		gameOverText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
		gameOverText.zIndex = 11;

		this.restartIcon = new PIXI.Sprite(this.restartTexture!);
		this.restartIcon.anchor.set(0.5);
		this.restartIcon.position.set(this.app.screen.width / 2, this.app.screen.height / 2 + 150); // Adjust position as needed
		this.restartIcon.width = 100;
		this.restartIcon.height = 100;
		this.restartIcon.zIndex = 12;
		this.restartIcon.interactive = true;
		(this.restartIcon as any).buttonMode = true;
		this.restartIcon.on('pointerdown', this.onRestartClick.bind(this));

		this.app.stage.addChild(gameOverBackground);
		this.app.stage.addChild(gameOverText);
		this.app.stage.addChild(this.restartIcon);
		this.app.stage.sortChildren();
	}

	onRestartClick() {

		location.reload(); // for now Reload the page to restart the game
	}

	setColor(sprite: PIXI.Sprite, color: number) {
		sprite.tint = color;
	}


}
