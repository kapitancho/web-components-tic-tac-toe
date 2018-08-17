

class XOBoard extends HTMLElement {
	constructor() {
		super();
		this.addEventListener('click', e => { this.handleClick(e.target); e.preventDefault(); e.stopPropagation(); });
	}
	get player() {
		return this.getAttribute('player');
	}
	set player(player) {
		this.setAttribute('player', player);
	}
	get isWinning() {
		return this.getAttribute('winning');
	}
	set isWinning(winning) {
		if (winning) {
			this.setAttribute('winning', winning);
		} else {
			this.removeAttribute('winning');
		}
	}
	nextPlayer() {
		const currentPlayer = this.player;
		const isWinning = this.checkWinCondition(currentPlayer);
		this.player = currentPlayer == 'x' ? 'o' : 'x';
		this.isWinning = isWinning ? currentPlayer : false;
		if (!isWinning) {
			if (this.isBoardFull()) {
				this.isWinning = 'draw';
			}
		}
	}
	restart() {
		this.player = 'x';
		this.isWinning = false;
		this.querySelectorAll('xo-square').forEach(sq => {
			sq.isWinning = false;
			sq.state = false;
		});
		
	}
	isBoardFull() {
		let isFull = true;
		this.querySelectorAll('xo-square').forEach(sq => {
			if (!sq.state) {
				isFull = false;
			}
		});
		return isFull;
	}
	checkWinCondition(player) {
		const matrix = {4:{0:8,1:7,2:6,3:5},0:{1:2,3:6},8:{2:5,6:7}};
		const squares = [... this.querySelectorAll('xo-square')];
		for (let f1 in matrix) {
			if (squares[f1].state == player) {
				for (let f2 in matrix[f1]) {
					if (squares[f2].state == player) {
						let f3 = matrix[f1][f2];
						if (squares[f3].state == player) {
							squares[f1].isWinning = squares[f2].isWinning = squares[f3].isWinning = player;
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName == 'player') {
		}
	}
	connectedCallback() {
		for (let i = 0; i < 9; i++) {
			let sq = document.createElement('xo-square');
			this.appendChild(sq);
		}
	}
	handleClick(target) {
		if (!this.isWinning && target.parentNode == this && !target.state) {
			target.state = this.player;
			this.nextPlayer();
		}
	}
}	

class XOSquare extends HTMLElement {
	static get observedAttributes() {
		return ['state'];
	}
	get state() {
		return this.getAttribute('state');
	}
	set state(state) {
		if (state) {
			this.setAttribute('state', state);
		} else {
			this.removeAttribute('state');
		}
	}
	get isWinning() {
		return this.getAttribute('winning');
	}
	set isWinning(winning) {
		if (winning) {
			this.setAttribute('winning', winning);
		} else {
			this.removeAttribute('winning');
		}
	}
	
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName == 'state') {
			this.innerText = newVal;
		}
	}
	connectedCallback() {
		this.innerText = this.getAttribute('state');
	}
}
customElements.define('xo-board', XOBoard);
customElements.define('xo-square', XOSquare);
