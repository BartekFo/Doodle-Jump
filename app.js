document.addEventListener('DOMContentLoaded', () => {
	//*Tworzenie elementów gry
	const grid = document.querySelector('.grid');
	const startBlockInfo = document.createElement('div');
	const doodler = document.createElement('div');
	const buttonStart = document.createElement('button');
	const buttonInfo = document.createElement('button');
	const HeadLineInfo = document.createElement('h1');
	const playInfo = document.createElement('article');
	const scoreDiv = document.createElement('div');
	const playInfoh1 = document.createElement('h1');
	const playInfoP = document.createElement('p');
	const playInfoButtonClose = document.createElement('div');

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
	let rightTimerId;
	let downPlatformId;
	let score = 0;

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
		playInfoh1.innerHTML = 'Jak grać?';
		playInfo.appendChild(playInfoh1);
		playInfoP.innerHTML =
			'Poruszaj się robotem za pomocą strzałek. Wciskajac lewą strzałkę by poruszać się w lewo, prawą by poruszać się w prawo oraz strzałkę w górę by zablokować pozycję i opadać w lini prostej. Po wskoczeniu na platforme robot wybije się sam po raz kolejny! Postraj się zdobyć jak najwięcej punktów i ustanowic nowy rekod!';
		playInfo.appendChild(playInfoP);
		playInfoButtonClose.innerHTML = '<i class="fas fa-times"></i>';
		playInfo.appendChild(playInfoButtonClose);
	}
	//*towrzenie klasy która tworzy platformy
	class Platform {
		constructor(newPlatBottom) {
			this.bottom = newPlatBottom;
			this.left = Math.random() * 315;
			this.visual = document.createElement('div');

			const visual = this.visual;
			visual.classList.add('platform');
			visual.style.width = '50px';
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
		if (doodlerBottomSpace > 300) {
			platforms.forEach((platform) => {
				platform.bottom -= 4;
				let visual = platform.visual;
				visual.style.bottom = platform.bottom + 'px';

				if (platform.bottom < 10) {
					let firstPlatform = platforms[0].visual;
					firstPlatform.classList.remove('platform');
					platforms.shift();
					score++;
					let newPlatform = new Platform(grid.clientHeight);
					platforms.push(newPlatform);
				}
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
		isGameOver = true;
		while (grid.firstChild) {
			grid.removeChild(grid.firstChild);
		}
		destroyPlatforms();
		grid.appendChild(startBlockInfo);
		createScoreInfo();
		startBlockInfo.hidden = false;
		clearInterval(upTimerId);
		clearInterval(downTimerId);
		clearInterval(leftTimerId);
		clearInterval(rightTimerId);
	}
	//*Funckja pokazujaca punkty na koniec gry
	const createScoreInfo = () => {
		scoreDiv.classList.add('scoreInfoLook');
		scoreDiv.innerHTML = score;
		startBlockInfo.appendChild(scoreDiv);
	};

	//*Funckaj odpowiada za kontorlowanie robota
	function control(e) {
		if (e.key === 'ArrowLeft' && !isGoingLeft) {
			moveLeft();
		} else if (e.key === 'ArrowRight' && !isGoingRight) {
			moveRight();
		} else if (e.key === 'ArrowUp') {
			moveStraight();
		}
	}
	//*Fucnkaj odpowiada za ruszanie w lewo
	function moveLeft() {
		if (isGoingRight) {
			clearInterval(rightTimerId);
			isGoingRight = false;
		}
		isGoingLeft = true;
		leftTimerId = setInterval(() => {
			if (doodlerLeftSpace > 0) {
				doodlerLeftSpace -= 5;
				doodler.style.left = doodlerLeftSpace + 'px';
			}
		}, 20);
	}
	//*Fucnkaj odpowiada za ruszanie w prawo
	const moveRight = () => {
		if (isGoingLeft) {
			clearInterval(leftTimerId);
			isGoingLeft = false;
		}
		isGoingRight = true;
		rightTimerId = setInterval(() => {
			if (doodlerLeftSpace <= 523) {
				doodlerLeftSpace += 5;
				doodler.style.left = doodlerLeftSpace + 'px';
			}
		}, 20);
	};
	//*Funkcja odpowiada za ustabilizowania ruchu
	const moveStraight = () => {
		clearInterval(leftTimerId);
		clearInterval(rightTimerId);
		isGoingLeft = false;
		isGoingRight = false;
	};
	//*Fucnkaj odpowiada za restart wszystkich timerów do ponownego rozpoczęcia gry
	const destroyPlatforms = () => {
		platforms = [];
		clearInterval(upTimerId);
		clearInterval(downTimerId);
		clearInterval(downPlatformId);
		moveStraight();
		startPoint = 150;
		doodlerBottomSpace == startPoint;
	};

	//* Rozpoczęcie aktulanej gry
	function start() {
		score = 0;
		if (!isGameOver) {
			createPlatforms();
			createDoodler();
			downPlatformId = setInterval(() => {
				movePlatforms();
			}, 30);
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
		isGameOver = false;
		start();
		startBlockInfo.hidden = true;
	});
	//* Przycisk pokazujący info jak grać
	buttonInfo.addEventListener('click', playInfoFun);

	playInfoButtonClose.addEventListener('click', () => {
		playInfo.hidden = true;
	});
});
