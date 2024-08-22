import * as PIXI from "pixi.js";
import { ELEMENT, TEXTURE } from "../types.ts";

export class Renderer {
	app: PIXI.Application;
	dragger: any;
	gameOverBackgroundTexture: PIXI.Texture | null = null;
	restartTexture: PIXI.Texture | null = null;
	restartIcon: PIXI.Sprite | null = null;
	constructor() {
		this.app = new PIXI.Application();
	}
	async init() {
		await this.app.init({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		this.app.stage.eventMode = "static";
		this.app.stage.hitArea = this.app.screen;
		this.app.stage.on("pointerup", () => {
			if (this.dragger) this.dragger.dragEnd();
		});
		this.app.stage.on("pointerupoutside", () => {
			if (this.dragger) this.dragger.dragEnd();
		});

		document.body.appendChild(this.app.canvas);

		// setting the background
		const bgPath = "../public/assets/bg5-2.jpg";
		const backgroundTexture = await PIXI.Assets.load(bgPath); //i am going to find a better color for bg texture
		const backgroundSprite = new PIXI.Sprite(backgroundTexture);
		backgroundSprite.zIndex = -10;
		backgroundSprite.width = this.app.screen.width;
		backgroundSprite.height = this.app.screen.height;
		this.stage(backgroundSprite);

		this.gameOverBackgroundTexture = await PIXI.Assets.load(
			"public/assets/level1.png"
		);
		this.restartTexture = await PIXI.Assets.load("public/assets/restart.png");
	}
	stage(...element: ELEMENT[]) {
		element.forEach((element) => this.app.stage.addChild(element));
	}
	getMid() {
		return { x: this.app.screen.width / 2, y: this.app.screen.height / 2 };
	}
	async loadAsset(path: string) {
		return await PIXI.Assets.load(path);
	}
	createSprite(texture: any) {
		return new PIXI.Sprite(texture);
	}
	animationLoop(callback: Function) {
		this.app.ticker.add(() => {
			callback();
		});
	}
	removeLoop(callback: Function) {
		this.app.ticker.remove(() => {
			callback();
		});
	}
	write(text: string, x: number, y: number) {
		const style = new PIXI.TextStyle({
			fill: "white",
			fontSize: 40,
			fontFamily: "Arial",
			align: "center",
			fontWeight: "bold",
		});
		const textSprite = new PIXI.Text({ text, style });
		textSprite.anchor.set(0.5);
		textSprite.position.set(x, y);
		return textSprite;
	}

	createGameOverText(text: string, x: number, y: number) {
		const style = new PIXI.TextStyle({
			fill: "white",
			fontSize: 80,
			fontFamily: "Arial",
			fontWeight: "bold",
			align: "center",
		});

		const gameOverText = new PIXI.Text({text, style});
		gameOverText.anchor.set(0.5);
		gameOverText.position.set(x, y);
		gameOverText.zIndex = 11;
		return gameOverText;
	}

	createGameOverBackground(
		texture: PIXI.Texture,
		width: number,
		height: number,
		verticalOffset: number = 0
	) {
		const gameOverBackground = new PIXI.Sprite(texture);
		gameOverBackground.anchor.set(0.5);
		gameOverBackground.position.set(
			this.app.screen.width / 2,
			this.app.screen.height / 2- verticalOffset
		);
		gameOverBackground.width = width;
		gameOverBackground.height = height;
		gameOverBackground.zIndex = 10;
		return gameOverBackground;
	}

	createRestartButton(
		texture: PIXI.Texture,
		width: number,
		height: number,
		position: { x: number; y: number },
		verticalOffset: number = 0
	) {
		const restartIcon = new PIXI.Sprite(texture);
		restartIcon.anchor.set(0.5);
		restartIcon.position.set(position.x, position.y- verticalOffset);
		restartIcon.width = width;
		restartIcon.height = height;
		restartIcon.zIndex = 12;
		restartIcon.interactive = true;
		(restartIcon as any).buttonMode = true;
		return restartIcon;
	}
}
