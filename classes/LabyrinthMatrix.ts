import { CellCoords, WayCell, WallCell } from './../interfaces/cells';
import  { DomDrawer} from './../classes/DomDrawer';
export class LabyrinthMatrix {
private cellMatrix: Array<Array<WayCell>> = [];
	private vWallMatrix: Array<Array<WallCell>> = [];
	private hWallMatrix: Array<Array<WallCell>> = [];
	private availableWalls: Array<number> = [];
	private nbrOfWallMerged = 0;
	private entrance: CellCoords;
	private exit: CellCoords;
	private previousWay: CellCoords;
	private nbrOfCells = 0;
	private nbrOfWalls = 0;
	constructor(private height: number, private width: number, private drawer: DomDrawer) {
		this.drawer.clean();
		this.createGrids();
		// this.createIO();
		// this.createNextWay();
		this.displayGrids();
		setTimeout(() => {
			this.createLabyrinth();
			this.createIO();
		}, 500)
	}

	createGrids (): void {
		let wallLineIndex = 0;
		// populate grid
		for (let y = 0; y < this.height; y++) {
			this.cellMatrix.push([])
			this.vWallMatrix.push([]);
			for (let x = 0; x < this.width; x++) {
				this.cellMatrix[y].push({ uid: this.nbrOfCells, current: this.nbrOfCells })
				this.nbrOfCells++;
				if (x !== this.width - 1) {
					this.vWallMatrix[y].push({ uid: this.nbrOfWalls, open: false });
					this.nbrOfWalls++;
				}
			}
			this.vWallMatrix[y].forEach((wall, wallIdx) => {
				wall.separate = [
					this.cellMatrix[y][wallIdx],
					this.cellMatrix[y][wallIdx + 1]
				];
			});
		}
		for (let y = 0; y < this.height - 1; y++) {
			let wallLine = [];
			for (let x = 0; x < this.width; x++) {
				wallLine.push({ uid: this.nbrOfWalls, open: false, separate: [
					this.cellMatrix[y][x],
					this.cellMatrix[y + 1][x]
				]});
				this.nbrOfWalls++;
			}
			this.hWallMatrix.push(wallLine);
		}
	}

	checkWall (wall: WallCell, wallUid: number, id: string) {
		let currentUid = wall.separate[0].current;
		let targetUid = wall.separate[1].current;
		if (currentUid !== targetUid) {
			wall.open = true;
			this.drawer.redrawCell(id, 'way', ' ');
			this.cellMatrix.forEach((line, lineIdx) => {
				line.forEach((cell, cellIdx) => {
					if ((cell.current === targetUid) || (cell.current === currentUid)) {
						cell.current = targetUid;
						this.drawer.redrawCell('cell-'  + lineIdx + '-' + cellIdx, 'way', ' ');
					}
				});
			});
			this.nbrOfWallMerged++;
		}
	}

	createLabyrinth () {
		this.availableWalls = Array.from(Array(this.nbrOfWalls).keys());
		let security = 0;
		while ((this.nbrOfWallMerged < this.nbrOfCells - 1) && (security < 10000)) {
			let wallIndex = this.getRandomInt(0, this.availableWalls.length - 1)
			let wallUid = this.availableWalls[wallIndex];
			let isVWall = false;
			let isHWall = false;
			this.vWallMatrix.forEach((line, lineIdx) => {
				line.forEach((wall: WallCell, wallIdx) => {
					if (wall.uid === wallUid) {
						isVWall = true;
						this.checkWall(wall, wallUid, 'v-wall-' + lineIdx + '-' + wallIdx);
					}
				});
			});
			if (!isVWall) {
				this.hWallMatrix.forEach((line, lineIdx) => {
					line.forEach((wall: WallCell, wallIdx) => {
						if (wall.uid === wallUid) {
							isHWall = true;
							this.checkWall(wall, wallUid, 'h-wall-' + lineIdx + '-' + wallIdx)
						}
					});
				});
			}
			security++;
			this.availableWalls.splice(wallIndex, 1);
		}

		// console.log('security', security);
		// console.log('nbrOfWallMerged', this.nbrOfWallMerged);
		// console.log('cellMatrix', this.cellMatrix);
		// console.log('vWallMatrix', this.vWallMatrix);
		// console.log('hWallMatrix', this.hWallMatrix);
	}

	createIO (): void {
		this.entrance = {
			y: 0,
			x: 0
		};
		this.exit = {
			y: this.height - 1,
			x: this.width - 1
		}
		let entranceDomId = 'cell-' + this.entrance.y + '-' + this.entrance.x;
		this.drawer.redrawCell(entranceDomId, 'entrance', ' ');
		let exitDomId = 'cell-' + this.exit.y + '-' + this.exit.x;
		this.drawer.redrawCell(exitDomId, 'exit', ' ');
	}

	displayGrids (): void {
		this.cellMatrix.forEach((line, lineIdx) => {
			let dLine = this.drawer.prepareLine()
			line.forEach((way: WayCell, cellIdx) => {
				this.drawer.drawCell(dLine, 'cell-' + lineIdx + '-' + cellIdx, way.current + '');
				if (cellIdx !== line.length - 1) {
					this.drawer.drawCell(dLine, 'v-wall-' + lineIdx + '-' + cellIdx, '#');
				}
			})
			this.drawer.drawLine(dLine);
			if (lineIdx !== this.cellMatrix.length - 1) {
				let wallLine = this.drawer.prepareLine();
				for (let i = 0; i < (line.length * 2) - 1; i++) {
					let wallId;
					if ((i + 2) % 2 === 0) {
						wallId = 'h-wall-' + lineIdx + '-' + (i / 2);
					}
					this.drawer.drawCell(wallLine, wallId, '#');
				}
				this.drawer.drawLine(wallLine);
			}
		})
	}

	getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}
