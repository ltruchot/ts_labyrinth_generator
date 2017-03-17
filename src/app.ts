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
    const directions = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
    let previousTile = this.matrix[this.previousWay.y][this.previousWay.x];

    while (directions.length) {
      let nextTile:TileCoords = { x:0, y:0 };
      let directionIdx = this.getRandomInt(0, directions.length - 1);
      const nextDirectionCoords = {
        'top': {
          x: this.previousWay.x,
          y: this.previousWay.y - 1
        },
        'top-right': {
          x: this.previousWay.x + 1,
          y: this.previousWay.y - 1
        },
        'right': {
          x: this.previousWay.x + 1,
          y: this.previousWay.y
        },
        'bottom-right': {
          x: this.previousWay.x + 1,
          y: this.previousWay.y + 1
        },
        'bottom': {
          x: this.previousWay.x,
          y: this.previousWay.y + 1
        },
        'bottom-left': {
          x: this.previousWay.x - 1,
          y: this.previousWay.y + 1
        },
        'left': {
          x: this.previousWay.x - 1,
          y: this.previousWay.y
        },
        'top-left': {
          x: this.previousWay.x - 1,
          y: this.previousWay.y - 1
        }
      }
      let direction = directions[directionIdx];
      let nextCoords = nextDirectionCoords[direction]
      let line = this.matrix[nextCoords.y];
      if ((!line) || isNaN(line[nextCoords.x]) ||(line[nextCoords.x] === this.tileIndexes.wall)) {
        directions.splice(directionIdx, 1);
      } else {
        this.matrix[nextCoords.y][nextCoords.x] = this.tileIndexes.wall // TODO: remove and put walls arround
        this.previousWay.x = nextCoords.x
        this.previousWay.y = nextCoords.y
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

