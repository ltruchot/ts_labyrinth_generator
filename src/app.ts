import { LabyrinthMatrix} from './../classes/LabyrinthMatrix';
import  { DomDrawer} from './../classes/DomDrawer';
const domDrawer = new DomDrawer('game-area');
function regenerate () {
	var heightInput = <HTMLInputElement>document.getElementById('lab-height');
	var widthInput = <HTMLInputElement>document.getElementById('lab-width');
	let height = +heightInput.value > 30 ? 30 : +heightInput.value;
	let width = +widthInput.value > 30 ? 30 : +widthInput.value;
	heightInput.value = height + '';
	widthInput.value = width + ''
	new LabyrinthMatrix(height, width, domDrawer);
}
regenerate();
var btnGenerate = <HTMLButtonElement>document.getElementById('btn-generate');
btnGenerate.onclick = regenerate;
