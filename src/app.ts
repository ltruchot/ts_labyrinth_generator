// npm i --save-dev transform-loader ts-loader typescript typings webpack webpack-dev-server tslint
import { TileDisplays, TileIndexes, TileCoords } from './../interfaces/tiles'
class Grid {
  public matrix:Array<Array<number>> = [];
  private tileIndexes:TileIndexes = {
    way: 0,
    wall: 1
  }
  private tileDisplays:TileDisplays = {
    way: '0',
    wall: '#'
  }
  private tileLinks:Array<string> = [
    this.tileDisplays.way,
    this.tileDisplays.wall
  ];
  private entrance:TileCoords;
  private exit:TileCoords;
  private previousWay:TileCoords;
  constructor(private height:number, private width:number) {
    this.createGrid();
    this.createIO();
    this.createNextWay();
    this.displayGridInHTML('zone');
  }

  createGrid () :void {
    // populate grid
    for (let y = 0; y < this.height; y++) {
      this.matrix.push([])
      for (let x = 0; x < this.width; x++) {
        let isTop = y === 0;
        let itsBottom = y  === (this.height - 1);
        let isLeft = x === 0;
        let isRight = x === (this.width - 1);

        // create border walls & inside everywhere ways
        if (isTop || isRight || itsBottom || isLeft) {
          this.matrix[y].push(this.tileIndexes.wall)
        } else {
          this.matrix[y].push(this.tileIndexes.way)
        }
      }
    }
  }
  createNextWay () :void {
    const directions = ['top','right','bottom','left'];
    let previousTile = this.matrix[this.previousWay.y][this.previousWay.x];

    while (directions.length) {
      let nextTile:TileCoords = { x:0, y:0 };
      let directionIdx = this.getRandomInt(0, directions.length - 1);
      switch(directions[directionIdx]) {
        case 'top':
          nextTile.x = this.previousWay.x
          nextTile.y = this.previousWay.y - 1
          break;
        case 'right':
          nextTile.x = this.previousWay.x + 1
          nextTile.y = this.previousWay.y
          break;
        case 'bottom':
          nextTile.x = this.previousWay.x
          nextTile.y = this.previousWay.y + 1
          break;
        case 'left':
          nextTile.x = this.previousWay.x - 1
          nextTile.y = this.previousWay.y
          break;
      }
      let line = this.matrix[nextTile.y]
      console.log(line[nextTile.x])
      if ((!line) || isNaN(line[nextTile.x]) ||(line[nextTile.x] === this.tileIndexes.wall)) {
        directions.splice(directionIdx, 1);
      } else {
        this.matrix[nextTile.y][nextTile.x] = this.tileIndexes.wall // TODO: remove and put walls arround
        this.previousWay.x = nextTile.x
        this.previousWay.y = nextTile.y
        directions.length = 0;
      }
    }
  }

  createIO () :void {
    this.entrance = {
      y: this.getRandomInt(1, this.height - 2),
      x: 0
    };
    this.exit = {
      y: this.getRandomInt(1, this.height - 2),
      x: this.matrix.length - 1
    }
    this.previousWay = this.entrance;
    this.matrix[this.entrance.y][this.entrance.x] = this.tileIndexes.way;
    this.matrix[this.exit.y][this.exit.x] = this.tileIndexes.way;
  }

   displayGridInHTML (elementId:string) {
    let zone:HTMLElement = document.getElementById(elementId);
    // append every ways
    this.matrix.forEach((line) => {
      line.forEach((tileIdx) => {
        zone.appendChild(this.createHtmlElement('span', this.tileLinks[tileIdx]));
      })
      zone.appendChild(this.createLimit());
    })
  }

  createHtmlElement (element:string, text:string) :HTMLElement {
    let tile:HTMLSpanElement = document.createElement(element);
    tile.innerText = text;
    return tile
  }

  createLimit () :HTMLElement {
    let nextLine:HTMLBRElement =  document.createElement('br');
    return nextLine
  }

  getRandomInt(min:number, max:number) :number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
const grid1 = new Grid(16, 16);

