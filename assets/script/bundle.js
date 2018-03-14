/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DomDrawer = (function () {
    function DomDrawer(domId) {
        this.mainArea = document.getElementById(domId);
    }
    DomDrawer.prototype.clean = function () {
        this.mainArea.innerHTML = '';
    };
    DomDrawer.prototype.prepareLine = function () {
        var htmlLine = this.createHtmlElement('div', 'line');
        return htmlLine;
    };
    DomDrawer.prototype.drawLine = function (line) {
        this.mainArea.appendChild(line);
    };
    DomDrawer.prototype.drawCell = function (line, id, content) {
        var cell = this.createHtmlElement('div', 'cell', id, content);
        line.appendChild(cell);
    };
    DomDrawer.prototype.redrawCell = function (id, type, content) {
        var cellHtmlEl = document.getElementById(id);
        if (content) {
            cellHtmlEl.innerText = content;
        }
        switch (type) {
            case 'entrance':
                cellHtmlEl.style.backgroundColor = 'green';
                break;
            case 'exit':
                cellHtmlEl.style.backgroundColor = 'red';
                break;
            case 'way':
                cellHtmlEl.style.backgroundColor = '#999999';
                break;
            default:
                cellHtmlEl.style.backgroundColor = 'white';
                break;
        }
    };
    DomDrawer.prototype.createHtmlElement = function (element, cssClass, id, content) {
        var el = document.createElement(element);
        if (id) {
            el.id = id;
        }
        if (content) {
            el.innerHTML = content;
        }
        ;
        if (cssClass) {
            el.className = cssClass;
        }
        ;
        return el;
    };
    DomDrawer.prototype.createLimit = function () {
        var nextLine = document.createElement('br');
        return nextLine;
    };
    return DomDrawer;
}());
exports.DomDrawer = DomDrawer;
;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LabyrinthMatrix = (function () {
    function LabyrinthMatrix(height, width, drawer) {
        var _this = this;
        this.height = height;
        this.width = width;
        this.drawer = drawer;
        this.cellMatrix = [];
        this.vWallMatrix = [];
        this.hWallMatrix = [];
        this.availableWalls = [];
        this.nbrOfWallMerged = 0;
        this.nbrOfCells = 0;
        this.nbrOfWalls = 0;
        this.drawer.clean();
        this.createGrids();
        this.displayGrids();
        setTimeout(function () {
            _this.createLabyrinth();
            _this.createIO();
        }, 500);
    }
    LabyrinthMatrix.prototype.createGrids = function () {
        var _this = this;
        var wallLineIndex = 0;
        var _loop_1 = function (y) {
            this_1.cellMatrix.push([]);
            this_1.vWallMatrix.push([]);
            for (var x = 0; x < this_1.width; x++) {
                this_1.cellMatrix[y].push({ uid: this_1.nbrOfCells, current: this_1.nbrOfCells });
                this_1.nbrOfCells++;
                if (x !== this_1.width - 1) {
                    this_1.vWallMatrix[y].push({ uid: this_1.nbrOfWalls, open: false });
                    this_1.nbrOfWalls++;
                }
            }
            this_1.vWallMatrix[y].forEach(function (wall, wallIdx) {
                wall.separate = [
                    _this.cellMatrix[y][wallIdx],
                    _this.cellMatrix[y][wallIdx + 1]
                ];
            });
        };
        var this_1 = this;
        for (var y = 0; y < this.height; y++) {
            _loop_1(y);
        }
        for (var y = 0; y < this.height - 1; y++) {
            var wallLine = [];
            for (var x = 0; x < this.width; x++) {
                wallLine.push({ uid: this.nbrOfWalls, open: false, separate: [
                        this.cellMatrix[y][x],
                        this.cellMatrix[y + 1][x]
                    ] });
                this.nbrOfWalls++;
            }
            this.hWallMatrix.push(wallLine);
        }
    };
    LabyrinthMatrix.prototype.checkWall = function (wall, wallUid, id) {
        var _this = this;
        var currentUid = wall.separate[0].current;
        var targetUid = wall.separate[1].current;
        if (currentUid !== targetUid) {
            wall.open = true;
            this.drawer.redrawCell(id, 'way', ' ');
            this.cellMatrix.forEach(function (line, lineIdx) {
                line.forEach(function (cell, cellIdx) {
                    if ((cell.current === targetUid) || (cell.current === currentUid)) {
                        cell.current = targetUid;
                        _this.drawer.redrawCell('cell-' + lineIdx + '-' + cellIdx, 'way', ' ');
                    }
                });
            });
            this.nbrOfWallMerged++;
        }
    };
    LabyrinthMatrix.prototype.createLabyrinth = function () {
        var _this = this;
        this.availableWalls = Array.from(Array(this.nbrOfWalls).keys());
        var security = 0;
        var _loop_2 = function () {
            var wallIndex = this_2.getRandomInt(0, this_2.availableWalls.length - 1);
            var wallUid = this_2.availableWalls[wallIndex];
            var isVWall = false;
            var isHWall = false;
            this_2.vWallMatrix.forEach(function (line, lineIdx) {
                line.forEach(function (wall, wallIdx) {
                    if (wall.uid === wallUid) {
                        isVWall = true;
                        _this.checkWall(wall, wallUid, 'v-wall-' + lineIdx + '-' + wallIdx);
                    }
                });
            });
            if (!isVWall) {
                this_2.hWallMatrix.forEach(function (line, lineIdx) {
                    line.forEach(function (wall, wallIdx) {
                        if (wall.uid === wallUid) {
                            isHWall = true;
                            _this.checkWall(wall, wallUid, 'h-wall-' + lineIdx + '-' + wallIdx);
                        }
                    });
                });
            }
            security++;
            this_2.availableWalls.splice(wallIndex, 1);
        };
        var this_2 = this;
        while ((this.nbrOfWallMerged < this.nbrOfCells - 1) && (security < 10000)) {
            _loop_2();
        }
    };
    LabyrinthMatrix.prototype.createIO = function () {
        this.entrance = {
            y: 0,
            x: 0
        };
        this.exit = {
            y: this.height - 1,
            x: this.width - 1
        };
        var entranceDomId = 'cell-' + this.entrance.y + '-' + this.entrance.x;
        this.drawer.redrawCell(entranceDomId, 'entrance', ' ');
        var exitDomId = 'cell-' + this.exit.y + '-' + this.exit.x;
        this.drawer.redrawCell(exitDomId, 'exit', ' ');
    };
    LabyrinthMatrix.prototype.displayGrids = function () {
        var _this = this;
        this.cellMatrix.forEach(function (line, lineIdx) {
            var dLine = _this.drawer.prepareLine();
            line.forEach(function (way, cellIdx) {
                _this.drawer.drawCell(dLine, 'cell-' + lineIdx + '-' + cellIdx, way.current + '');
                if (cellIdx !== line.length - 1) {
                    _this.drawer.drawCell(dLine, 'v-wall-' + lineIdx + '-' + cellIdx, '#');
                }
            });
            _this.drawer.drawLine(dLine);
            if (lineIdx !== _this.cellMatrix.length - 1) {
                var wallLine = _this.drawer.prepareLine();
                for (var i = 0; i < (line.length * 2) - 1; i++) {
                    var wallId = void 0;
                    if ((i + 2) % 2 === 0) {
                        wallId = 'h-wall-' + lineIdx + '-' + (i / 2);
                    }
                    _this.drawer.drawCell(wallLine, wallId, '#');
                }
                _this.drawer.drawLine(wallLine);
            }
        });
    };
    LabyrinthMatrix.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return LabyrinthMatrix;
}());
exports.LabyrinthMatrix = LabyrinthMatrix;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LabyrinthMatrix_1 = __webpack_require__(1);
var DomDrawer_1 = __webpack_require__(0);
var domDrawer = new DomDrawer_1.DomDrawer('game-area');
function regenerate() {
    var heightInput = document.getElementById('lab-height');
    var widthInput = document.getElementById('lab-width');
    var height = +heightInput.value > 30 ? 30 : +heightInput.value;
    var width = +widthInput.value > 30 ? 30 : +widthInput.value;
    heightInput.value = height + '';
    widthInput.value = width + '';
    new LabyrinthMatrix_1.LabyrinthMatrix(height, width, domDrawer);
}
regenerate();
var btnGenerate = document.getElementById('btn-generate');
btnGenerate.onclick = regenerate;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map