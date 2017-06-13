export class DomDrawer {
	private mainArea: HTMLElement;
	private domObserver: MutationObserver;
	constructor(domId: string) {
		this.mainArea = document.getElementById(domId);
		// this.domObserver = new MutationObserver(function(mutations) {
		// 	mutations.forEach(function(mutation) {
		// 		if (!mutation.addedNodes) { return; }
		// 		for (let i = 0; i < mutation.addedNodes.length; i++) {
		// 			// do things to your newly added nodes here
		// 			let node = mutation.addedNodes[i]
		// 		}
		// 	})
		// })
		// this.domObserver.observe(document.body, {
		// 		childList: true
		// 	, subtree: true
		// 	, attributes: false
		// 	, characterData: false
		// })

		// // stop watching using:
		// this.domObserver.disconnect()
	}
	clean (): void {
		this.mainArea.innerHTML = '';
	}

	prepareLine (): HTMLElement {
		let htmlLine = this.createHtmlElement('div', 'line');
		return htmlLine;
	}
	drawLine (line: HTMLElement) {
		this.mainArea.appendChild(line);
	}
	drawCell (line: HTMLElement, id?: string, content?: string) {
		let cell = this.createHtmlElement('div', 'cell', id, content);
		line.appendChild(cell);
	}
	redrawCell (id: string, type?: string, content?: string) {
		let cellHtmlEl = document.getElementById(id);
		if (content) { cellHtmlEl.innerText = content; }
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
	}

	createHtmlElement (element: string, cssClass?: string, id?: string, content?: string): HTMLElement {
		let el: HTMLElement = document.createElement(element);
		if (id) { el.id = id; }
		if (content) { el.innerHTML = content; };
		if (cssClass) { el.className = cssClass };
		return el
	}

	createLimit (): HTMLElement {
		let nextLine: HTMLBRElement =  document.createElement('br');
		return nextLine
	}
};
