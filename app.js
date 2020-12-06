document.addEventListener('DOMContentLoaded', () => {
	//*Tworzenie elementów gry
	const grid = document.querySelector('.grid');
	const startBlockInfo = document.createElement('div');
	const doodler = document.createElement('div');
	const buttonStart = document.createElement('button');
	const buttonInfo = document.createElement('button');
	const HeadLineInfo = document.createElement('h1');
	const playInfo = document.createElement('article');

	//* Ważne zmienne dotyczące całej gry
	let doodlerLeftSpace = 50;
	let startPoint = 150;
	let doodlerBottomSpace = startPoint;
	let isGameOver = false;
	let platformCount = 5;
	let platforms = [];
	let upTimerId;
	let downTimerId;
	let isJumping = true;
	let isGoingLeft = false;
	let isGoingRight = false;
	let leftTimerId;
	let rightTimerID;

	//*Stowrzenie ludzika skaczącego
	const createDoodler = () => {
		grid.appendChild(doodler);
		doodler.classList.add('doodler');
		doodlerLeftSpace = platforms[0].left;
		doodler.style.left = `${doodlerLeftSpace}px`;
		doodler.style.bottom = `${doodlerBottomSpace}px`;
	};
	//* Pokazanie informacji jak grać
	function playInfoFun() {
		playInfo.hidden = false;
	}
	//*towrzenie klasy która tworzy platformy
	class Platform {
		constructor(newPlatBottom) {
			this.bottom = newPlatBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement('div');

			const visual = this.visual;
			visual.classList.add('platform');
			visual.style.left = this.left + 'px';
			visual.style.bottom = this.bottom + 'px';
			grid.appendChild(visual);
		}
	}

	//* Stworzneie 5 platform
	function createPlatforms() {
		for (let i = 0; i < platformCount; i++) {
			let platGap = grid.clientHeight / platformCount;
			let newPlatBottom = 100 + i * platGap;
			let newPlatform = new Platform(newPlatBottom);
			platforms.push(newPlatform);
		}
	}
	//* poruszanie platformą
	function movePlatforms() {
		if (doodlerBottomSpace > 200) {
			platforms.forEach((platform) => {
				platform.bottom -= 4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + 'px';
			});
		}
	}

	//*odpowada za skok
	function jump() {
		clearInterval(downTimerId);
		isJumping = true;
		upTimerId = setInterval(function () {
			doodlerBottomSpace += 20;
			doodler.style.bottom = doodlerBottomSpace + 'px';
			if (doodlerBottomSpace > startPoint + 200) {
				fall();
			}
		}, 30);
	}

	//*odpowiadania za przerwanie skoku i opadanie
	function fall() {
		clearInterval(upTimerId);
		isJumping = false;
		downTimerId = setInterval(() => {
			doodlerBottomSpace -= 5;
			doodler.style.bottom = doodlerBottomSpace + 'px';
			if (doodlerBottomSpace <= 0) {
				gameOver();
			}
			platforms.forEach((platform) => {
				if (
					doodlerBottomSpace >= platform.bottom &&
					doodlerBottomSpace <= platform.bottom + 15 &&
					doodlerLeftSpace + 75 >= platform.left &&
					doodlerLeftSpace <= platform.left + 85 &&
					!isJumping
				) {
					console.log('landed');
					startPoint = doodlerBottomSpace;
					jump();
				}
			});
		}, 30);
	}

	//*funckaj odopowadająca za kontrole czy nasz gracz spadł
	function gameOver() {
		console.log('gameover');
		isGameOver = true;
		clearInterval(upTimerId);
		clearInterval(downTimerId);
	}

	function control(e) {
		if (e.key === 'ArrowLeft') {
			moveLeft();
		} else if (e.key === 'ArrowRight') {
			//moveRight
		} else if (e.key === 'ArrowUp') {
			//moveStraight
		}
	}

	function moveLeft() {
		isGoingLeft = true;
		leftTimerId = setInterval(() => {
			if (doodlerLeftSpace >= 0) {
				doodlerLeftSpace -= 5;
				doodler.style.left = doodlerLeftSpace + 'px';
			} else moveRight();
		}, 30);
	}

	const moveRight = () => {};

	//* Rozpoczęcie aktulanej gry
	function start() {
		if (!isGameOver) {
			createPlatforms();
			createDoodler();
			setInterval(movePlatforms, 30);
			jump();
			document.addEventListener('keyup', control);
		}
	}
	//* Tutaj się zaczyna gra i pokazane są dwa przyciski
	const showInfo = () => {
		grid.appendChild(startBlockInfo);
		startBlockInfo.appendChild(buttonStart);
		startBlockInfo.appendChild(buttonInfo);
		startBlockInfo.appendChild(HeadLineInfo);
		startBlockInfo.appendChild(playInfo);
		buttonInfo.classList.add('btn');
		buttonInfo.style.bottom = '25%';
		buttonInfo.innerHTML = 'How to play';
		buttonStart.classList.add('btn');
		buttonStart.innerHTML = 'Start game';
		HeadLineInfo.classList.add('headLineInfo');
		HeadLineInfo.innerHTML = 'Robot Jump!';
		playInfo.classList.add('playInfo');
		playInfo.hidden = true;
	};
	//*Wywołanie funkcji zaczynjącej grę
	showInfo();
	//*Przycisk rozpoczynający grę
	buttonStart.addEventListener('click', () => {
		start();
		startBlockInfo.hidden = true;
	});
	//* Przycisk pokazujący info jak grać
	buttonInfo.addEventListener('click', playInfoFun);
});
