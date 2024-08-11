import * as PIXI from "pixi.js"


async function main() {
	// Create a Pixi Application
	const app = new PIXI.Application();

	await app.init({ background: '#000', resizeTo: window });
	document.body.appendChild(app.canvas);

}

main()
