import { RENDERER, TEXTURE, GRIDINFO, MATCH, DIRECTION } from "../types";
import { Candies } from "./candy";
export class Grid {
	gridImg: TEXTURE
	renderer: RENDERER
	width: number
	height: number
	gridPos: { x: number, y: number }
	gridInfo: GRIDINFO
	constructor(renderer: RENDERER) {
		this.renderer = renderer
	}
	async init() { // load spite for grid
		this.gridImg = await this.renderer.loadAsset("assets/grid1.png");
	}
	checkValidity(direction: DIRECTION, matches: MATCH[], r: number, c: number) {
		const candyId = this.gridInfo[r][c].candyId
		const start = direction == "vertical" ? r == 0 : c == 0
		if (start) {
			matches.push({
				startIndex: { r, c },
				count: 1,
				direction,
				candyId
			})
		}
		else {
			const lastIndex = matches.length >= 0 ? matches.length - 1 : 0
			const isMatch: boolean = lastIndex >= 0 ? matches[lastIndex].candyId == candyId : false
			if (isMatch)
				matches[lastIndex].count += 1
			else {
				matches.push({
					startIndex: { r, c },
					count: 1,
					direction,
					candyId
				})
			}
		}

	}
	checkGrid() {  // checking the whole grid   
		let matches: MATCH[] = []
		const numRows = this.gridInfo.length
		const numCols = this.gridInfo[0].length
		for (let r = 0; r < numRows; r++) {
			let match: MATCH[] = []
			for (let c = 0; c < numCols; c++) {
				this.checkValidity("horizontal", match, r, c)
			}
			matches.push(...match.filter(x => x.count > 2))
		}

		for (let c = 0; c < numCols; c++) {
			let match: MATCH[] = []
			for (let r = 0; r < numRows; r++) {
				this.checkValidity("vertical", match, r, c)
			}
			matches.push(...match.filter(x => x.count > 2))
		}
		return matches
	}
	async fillCol(matches: MATCH[], candies: Candies) {
		if (matches.length == 0) return
		let colToClear: Set<number> = new Set()
		// Step 1: Clear matched candies and collect columns to clear
		for (let item of matches) {
			for (let count = 0; count < item.count; count++) {
				const row = item.direction == "vertical"
					? item.startIndex.r + count
					: item.startIndex.r;
				const col = item.direction == "horizontal"
					? item.startIndex.c + count
					: item.startIndex.c;

				const candy = this.gridInfo[row][col].candy;
				if (candy) {
					candy.destroy()
					// Optionally destroy the candy object
					this.gridInfo[row][col].candyId = -1;
					this.gridInfo[row][col].candy = undefined;
					colToClear.add(col);
				}
			}
		}

		// Step 2: Shift candies down in columns that had matches
		for (let c of colToClear) {
			let emptyCount = 0;
			for (let r = this.gridInfo.length - 1; r >= 0; r--) {
				if (this.gridInfo[r][c].candyId == -1) { // Empty slot
					emptyCount++;
				} else if (emptyCount > 0) {
					console.log(emptyCount)
					// Move the candy down by the number of empty slots below
					const candyMoving = this.gridInfo[r][c]
					const candyMovingTo = this.gridInfo[r + emptyCount][c]
					if (candyMoving.candy && candyMovingTo.y) {
						// candyMoving.candy.position.y = candyMovingTo.y
						await candies.fallDown(candyMoving.candy, candyMovingTo.y, 6)
					}
					// Set the new slot
					this.gridInfo[r + emptyCount][c].candyId = candyMoving.candyId;
					this.gridInfo[r + emptyCount][c].candy = candyMoving.candy;
					// Clear the old slot
					this.gridInfo[r][c].candyId = -1;
					this.gridInfo[r][c].candy = undefined;
				}
			}
		}

		// Step 3: spawn new candies
		for (let c of colToClear) {
			for (let r = 0; r < this.gridInfo.length; r++) {
				if (this.gridInfo[r][c].candyId == -1) { // is empty
					const candyId = Math.floor(Math.random() * 6)
					const candy = candies.createCandy(candyId)
					candies.spawn(this.gridInfo[r][c].x, this.gridInfo[r][c].y, this.gridInfo[r][c].cellSize, candy)
					this.gridInfo[r][c].candyId = candyId
					this.gridInfo[r][c].candy = candy
					this.renderer.stage(candy)
				}
				else
					break
			}
		}

	}

	//check if two positions are adjacent
	areAdjacent(pos1: { x: number, y: number }, pos2: { x: number, y: number }): boolean {
		const dx = Math.abs(pos1.x - pos2.x);
		const dy = Math.abs(pos1.y - pos2.y);
		return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
	}


	getGridPosition(position: { x: number, y: number }) {
		const cellSize = this.gridInfo[0][0].cellSize;
		const row = Math.floor((position.y - this.gridPos.y) / cellSize);
		const col = Math.floor((position.x - this.gridPos.x) / cellSize);
		return { r: row, c: col };
	}


	async makeGrid(row: number, col: number) { // create grid
		await this.init()
		const grid: { x: number, y: number, cellSize: number, candyId: number }[][] = Array.from({ length: row }, () => Array(col).fill(0))
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
		for (let r = 0; r < row; r++) {
			for (let c = 0; c < col; c++) {
				const cellSprite = this.renderer.createSprite(this.gridImg)
				const x = c * (cellSize + margin) + offset.x
				const y = r * (cellSize + margin) + offset.y
				cellSprite.position.set(x, y)
				cellSprite.width = cellSize
				cellSprite.height = cellSize
				this.renderer.stage(cellSprite)
				const candyId = Math.floor(Math.random() * 6)
				grid[r][c] = { x, y, cellSize, candyId }
			}
		}
		this.gridInfo = grid
		return grid
	}
}
