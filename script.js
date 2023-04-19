const GameBoard = () => {
	/****DEFINITIONS ON FACTORY START****/
	let boardSize = 3;
	let boardArr = [];

	/****PRIVATE FUNCTIONS****/

	//CREATES THE TTT 3X3 BOARD
	let createBoard = () => {
		for (let i = 0; i < boardSize; ++i) {
			let rowArr = [];
			for (let j = 0; j < boardSize; ++j) {
				rowArr.push("");
			}
			boardArr.push(rowArr);
		}
	};

	//LOGS THE BOARD AS A 2D TABLE IN THE CONSOLE
	let logBoard = () => {
		console.table(boardArr);
	};

	//RETURNS TRUE IF THE SPACE AT THE GIVEN COORDS IS EMPTY
	//FALSE OTHERWISE
	let isAvailable = (coords) => {
		return !boardArr[coords.y][coords.x];
	};

	//RETURN TRUE IF THE GIVEN COORDS ARE INSIDE THE BOARD
	//(THIS FUNCTION IS ONLY FOR CONSOLE OR DIRECT COORDS INPUTS)
	let isInBound = (coords) => {
		return (
			coords.x >= 0 &&
			coords.x <= boardSize &&
			coords.y >= 0 &&
			coords.y <= boardSize
		);
	};

	/****PUBLIC FUNCTIONS****/

	//DOES THE NECESSARY CHECKS AND PLACES THE GIVEN TOKEN AT THE GIVEN COORDS IN THE BOARD
	//RETURNS TRUE IF PLACED FALSE OTHERWISE
	let place = (coords, token) => {
		if (!isInBound(coords)) {
			return false;
		}

		if (!isAvailable(coords)) {
			return false;
		}

		boardArr[coords.y][coords.x] = token;
		return true;
	};

	//RETURNS THE CURRENT STATE OF THE BOARD AS AN ARR
	let getBoardArr = () => {
		return boardArr;
	};

	//RETURNS TRUE IF THE BOARD IS COMPLETELY FILLED WITH TOKENS
	//FALSE OTHERWISE
	let isFull = () => {
		let full = true;

		boardArr.forEach((row) =>
			row.forEach((square) => {
				if (square === "") full = false;
				return full;
			})
		);

		return full;
	};

	//CLEARS THE BOARD AND CREATES A NEW EMPTY BOARD
	let reset = () => {
		boardArr = [];
		createBoard();
	};

	/****FACTORY FUNCTION START STATE****/
	createBoard();

	//GAMEBOARD OBJECT
	return { place, getBoardArr, isFull, reset };
};

const Player = (name, token) => {
	//GETTERS
	let getName = () => name;
	let getToken = () => token;

	//PLAYER OBJECT
	return { getName, getToken };
};

const Computer = (token) => {
	//OBJECT TO INHERIT
	let obj = Player("Computer", token);

	//USES THE GIVEN BOARDSTATE TO CREATE A RANDOM MOVE
	let getMove = (boardState) => {
		let computerMove;

		//CREATE MOVE AND CHECK IF THE SPACE IS AVAILABLE
		do {
			computerMove = {
				x: Math.floor(Math.random() * boardState.length),
				y: Math.floor(Math.random() * boardState.length),
			};
		} while (boardState[computerMove.y][computerMove.x]);

		return computerMove;
	};

	//COMPUTER OBJECT
	return Object.assign({}, obj, { getMove });
};

const GameController = (players) => {
	/****DEFINITIONS ON FACTORY START****/

	//CREATE BOARD
	const board = GameBoard();
	let currPlayer = players[0];

	//STATE OBJECT FOR DISPLAYING WIN OR TIE AND WIN INFORMATION
	let state = {};

	//THE COORDS OF TOKEN THAT TRIGGERED WIN CONDITION TO RETURN FOR DISPLAY
	let winCoords = [];

	/****PRIVATE FUNCTIONS****/

	//LOOP THROUGH THE ROWS TO CHECK FOR WIN IN THE GIVEN BOARD FOR THE GIVEN TOKEN
	let checkHorizontal = (boardState, token) => {
		for (let i = 0; i < boardState.length; ++i) {
			let count = 0;
			for (let j = 0; j < boardState[i].length; ++j) {
				if (boardState[i][j] === token) {
					++count;
					winCoords.push({ x: j, y: i });
				}
				if (count >= 3) {
					return true;
				}
			}
			winCoords.length = 0;
		}

		return false;
	};

	//LOOP THROUGH THE COLUMNS TO CHECK FOR WIN IN THE GIVEN BOARD FOR THE GIVEN TOKEN
	let checkVertical = (boardState, token) => {
		for (let i = 0; i < boardState.length; ++i) {
			let count = 0;
			for (let j = 0; j < boardState.length; ++j) {
				if (boardState[j][i] === token) {
					++count;
					winCoords.push({ x: i, y: j });
				}

				if (count >= 3) {
					return true;
				}
			}
			winCoords.length = 0;
		}

		return false;
	};

	//LOOP THROUGH THE BOARD AND CHECK IF THE MAIN DIAGONAL CELLS HAVE THE SAME 3 TOKEN
	let checkMainDiagonal = (boardState, token) => {
		let count = 0;
		for (let i = 0; i < boardState.length; ++i) {
			for (let j = 0; j < boardState.length; ++j) {
				//main diagonal spots
				if (i === j) {
					if (boardState[i][j] === token) {
						++count;
						winCoords.push({ x: j, y: i });
					}
				}

				if (count >= 3) {
					return true;
				}
			}
		}

		winCoords.length = 0;
		return false;
	};

	//LOOP THROUGH THE BOARD AND CHECK IF THE ANTI DIAGONAL CELLS HAVE THE SAME 3 TOKEN
	let checkAntiDiagonal = (boardState, token) => {
		let count = 0;
		for (let i = 0; i < boardState.length; ++i) {
			for (let j = 0; j < boardState.length; ++j) {
				if (i + j == boardState.length - 1) {
					//anti daigonal spots
					if (boardState[i][j] === token) {
						++count;
						winCoords.push({ x: j, y: i });
					}
				}

				if (count >= 3) {
					return true;
				}
			}
		}
		winCoords.length = 0;
		return false;
	};

	//RETURNS TRUE IF EITHER OF THE DIAGONALS TRIGGER THE WIN CONDITION
	let checkDiagonals = (boardState, token) => {
		return (
			checkMainDiagonal(boardState, token) ||
			checkAntiDiagonal(boardState, token)
		);
	};

	//CHECK ALL THE WIN CONDITIONS FOR THE CURRENT TOKEN AND BOARD STATE
	let checkWin = () => {
		let boardState = board.getBoardArr();
		let token = currPlayer.getToken();

		return (
			checkHorizontal(boardState, token) ||
			checkVertical(boardState, token) ||
			checkDiagonals(boardState, token)
		);
	};

	//SWITCH THE CURRENT PLAYER
	let switchPlayer = () => {
		if (currPlayer === players[0]) {
			currPlayer = players[1];
		} else {
			currPlayer = players[0];
		}
	};

	//HANDLE "AFTERMATH" AFTER A MOVE IS PLAYED
	//CHECK IF THERE WAS A WIN OR A DRAW AND UPDATE THE STATE OBJECT
	//SWITCH PLAYER IF ABLE TO
	let changeTurn = () => {
		if (state.placed) {
			state.won = checkWin();
			state.draw = board.isFull();
			if (state.won) {
				state.winCoords = winCoords;
			}

			if (!state.won && !state.draw) {
				switchPlayer();
			}
		}

		return state;
	};

	/****PUBLIC FUNCTIONS****/

	//RETURN THE CURRENT PLAYER
	let getCurrPlayer = () => currPlayer;

	//RETURN ALL THE PLAYERS IN THE GAME
	let getPlayers = () => {
		return players;
	};

	//PLACE THE GIVEN COORDS IN THE BOARD AND UPDATE STATE
	let play = (coords) => {
		state.placed = board.place(coords, currPlayer.getToken());

		return changeTurn();
	};

	//RESET THE GAME STATE AND THE BOARD TO THE INITIAL CONDITION
	let reset = () => {
		state = {};
		currPlayer = players[0];
		board.reset();
	};

	//GAMECONTROLLER OBJECT
	return {
		play,
		getCurrPlayer,
		getPlayers,
		getBoardArr: board.getBoardArr,
		reset,
	};
};

const Game = (gameState) => {
	//CREATE COMPUTER IF THE GAMESTATE IS SINGLEPLAYER
	if (gameState.name === "singleplayer") {
		let compToken;
		if (gameState.players[0].getToken() === "x") compToken = "o";
		else compToken = "x";

		const computer = Computer(compToken);
		gameState.players.push(computer);
	}

	//CREATE CONTROLLER WITH THE PLAYERS BASED ON THE GAMESTATE
	const controller = GameController(gameState.players);

	//HANDLE PLAY BASED ON THE GAMESTATE
	let play = (coords) => {
		let state = controller.play(coords);

		if (gameState.name === "singleplayer") {
			if (!state.won && !state.draw && state.placed) {
				let computer = gameState.players[1];
				state = controller.play(computer.getMove(controller.getBoardArr()));
			}
		}

		return state;
	};

	//GAME OBJECT
	return {
		play,
		getPlayers: controller.getPlayers,
		getBoardArr: controller.getBoardArr,
		getCurrPlayer: controller.getCurrPlayer,
		reset: controller.reset,
	};
};

const DisplayController = (() => {
	/****DEFINITIONS ON FACTORY START****/
	let game;
	let result = {};
	let gameState = {};

	/****DOM ELEMENTS****/
	const main = document.querySelector("main");
	let menuContainer;

	/****CONTROL FUNCTIONS****/
	let clearMenu = () => {
		//Remove everything
		main.textContent = "";
	};

	//RETURNS TRUE IF TOKEN IS SELECTED
	//FALSE OTHERWISE
	let checkToken = () => {
		const selected = document.querySelector(".selected-btn");
		return selected;
	};

	//UPDATES THE DISPLAY WITH THE LATEST STATE OF THE GAMEBOARD AND THE GAME INFO
	let updateDisplay = () => {
		const displayContainer = document.createElement("section");
		displayContainer.classList.add("display", "paper", "main-border");

		const infoContainer = document.createElement("div");
		infoContainer.classList.add("info-container");

		const players = game.getPlayers();
		players.forEach((player) => {
			const playerContainer = document.createElement("div");
			playerContainer.classList.add("player-container");

			const playerName = document.createElement("p");
			playerName.classList.add("player-name");
			playerName.textContent = player.getName();

			const playerToken = document.createElement("p");
			playerToken.classList.add("token-container");
			playerToken.textContent = player.getToken();

			if (player.getToken() === game.getCurrPlayer().getToken()) {
				playerName.classList.add("current-player");
				playerToken.classList.add("current-player");
			}

			playerContainer.append(playerName, playerToken);
			infoContainer.appendChild(playerContainer);
		});

		main.textContent = "";

		const board = game.getBoardArr();
		const boardContainer = document.createElement("div");
		boardContainer.classList.add("board");

		for (let i = 0; i < board.length; ++i) {
			let row = board[i];
			const rowDisplay = document.createElement("div");
			rowDisplay.classList.add("row");

			for (let j = 0; j < row.length; ++j) {
				const square = document.createElement("button");
				square.classList.add("square");

				if (i == 0) {
					square.classList.add("top-cell");
				} else if (i == board.length - 1) {
					square.classList.add("bottom-cell");
				}

				if (j == 0) {
					square.classList.add("left-cell");
				} else if (j == board.length - 1) {
					square.classList.add("right-cell");
				}

				square.dataset.row = i;
				square.dataset.column = j;

				square.textContent = board[i][j];
				if (!result.won) square.addEventListener("click", move);
				else {
					for (let k = 0; k < result.winCoords.length; ++k) {
						if (i === result.winCoords[k].y && j === result.winCoords[k].x) {
							square.classList.add("win-cell");
						}
					}
				}

				rowDisplay.appendChild(square);
			}
			boardContainer.appendChild(rowDisplay);
		}

		displayContainer.append(infoContainer, boardContainer);

		main.appendChild(displayContainer);

		if (result.won || result.draw) {
			displayContainer.classList.add("dim");

			const resultContainer = document.createElement("div");
			resultContainer.classList.add("result-container", "main-border");

			const bg = document.createElement("img");
			bg.src = "assets/paperContainer.png";
			bg.classList.add("yellow-paper");

			const resultText = document.createElement("p");
			resultText.classList.add("result-text");

			if (result.won) {
				let winner = game.getCurrPlayer().getName();
				resultText.textContent = `WINNER: ${winner}`;
			} else {
				resultText.textContent = "ITS A TIE! GG";
			}

			const restartBtn = document.createElement("button");
			restartBtn.textContent = "Restart";
			restartBtn.classList.add("ui-border", "ui-btn");
			restartBtn.addEventListener("click", handleRestart);

			const menuBtn = document.createElement("button");
			menuBtn.textContent = "Menu";
			menuBtn.classList.add("ui-border", "ui-btn");
			menuBtn.addEventListener("click", goMenu);

			resultContainer.append(bg, resultText, restartBtn, menuBtn);

			main.appendChild(resultContainer);
		}
	};

	/****EVENT HANDLERS****/

	//GETS THE CHOSEN GAMESTATE AND CREATES SECONDARY MENU BASED ON IT
	let handleGameBtn = (e) => {
		gameState.name = e.currentTarget.dataset.gameState;

		clearMenu();
		createSecondaryMenu();
	};

	//SELECTS THE TOKEN BTN FOR PLAYERS
	let handleTokenBtn = (e) => {
		//remove the selected btns
		const tokenBtns = document.querySelectorAll(".token-btn");
		tokenBtns.forEach((btn) => {
			btn.classList.remove("selected-btn");
		});

		const clickedBtn = e.currentTarget;
		clickedBtn.classList.add("selected-btn");

		const token = clickedBtn.dataset.token;

		const playerId = clickedBtn.closest(".player-info").dataset.playerId;

		let otherToken;
		if (token == "x") otherToken = "o";
		else otherToken = "x";

		const otherBtns = menuContainer.querySelectorAll(
			`.token-btn[data-token="${otherToken}"]`
		);

		otherBtns.forEach((btn) => {
			if (playerId != btn.closest(".player-info").dataset.playerId) {
				btn.classList.add("selected-btn");
			}
		});
	};

	//STARTS THE GAME BASED ON THE SECONDARY MENU INPUTS AND THE GAMESTATE
	let handleStart = (e) => {
		e.preventDefault();

		if (checkToken()) {
			const form = e.currentTarget;
			const fields = form.querySelectorAll(".player-info");

			gameState.players = [];
			fields.forEach((field) => {
				let name = field.querySelector("input").value;
				let token = field.querySelector(".selected-btn").dataset.token;

				gameState.players.push(Player(name, token));
			});

			game = Game(gameState);
			menuContainer.classList.add("hide"); //remove instead of hide later
			updateDisplay();
		} else {
			alert("Please select a token :)");
		}
	};

	//RESTARTS THE GAME
	let handleRestart = () => {
		//clear result
		result = {};
		//clear game
		game.reset();

		updateDisplay();
	};

	//CLOSES THE GAME AND RETURNS BACK TO THE MAIN MENU
	let goMenu = () => {
		handleRestart();
		main.textContent = "";
		createMainMenu();
	};

	//GETS THE COORDS OF THE CELL IN THE DOM BOARD AND PLAYS A ROUND WITH THE COORDS
	let move = (e) => {
		let clickedCoords = {
			x: e.currentTarget.dataset.column,
			y: e.currentTarget.dataset.row,
		};

		result = game.play(clickedCoords);

		updateDisplay();
	};

	/****DOM CREATORS****/
	let createMenuContainer = () => {
		menuContainer = document.createElement("section");
		menuContainer.classList.add("menu-container", "main-border");

		//CREATE BACKGROUND
		const bg = document.createElement("img");
		bg.src = "assets/paperContainer.png";
		bg.classList.add("yellow-paper");

		menuContainer.appendChild(bg);
	};

	//CREATES SECONDARY MENU BASED ON THE GAME STATE
	//INPUTS THE PLAYER NAMES AND PIECES
	let createSecondaryMenu = () => {
		createMenuContainer();
		//predefined rules
		const gameRules = {
			multiplayer:
				"Play against another player, enter your names and select a unique piece.",
			singleplayer:
				"Play against the computer, enter your name and select the piece you want to play with.",
		};

		let playerCount;
		if (gameState.name === "multiplayer") {
			playerCount = 2;
		} else {
			playerCount = 1;
		}

		const tokenCount = 2;

		const title = document.createElement("h2");

		//capitalize
		title.textContent =
			gameState.name.charAt(0).toUpperCase() + gameState.name.slice(1);

		const menu = document.createElement("form");
		menu.classList = "menu";

		menu.appendChild(title);

		for (let i = 0; i < playerCount; ++i) {
			const playerInfo = document.createElement("div");
			playerInfo.classList.add("player-info");
			playerInfo.dataset.playerId = i;

			const field = document.createElement("fieldset");
			field.classList.add("player-name");

			const label = document.createElement("label");
			label.setAttribute("for", "first-player");
			label.textContent = `Player ${i + 1}:`;

			const input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("id", "first-player");
			input.classList.add("ui-border", "ui-input");
			input.required = true;
			input.setAttribute("maxlength", 10);
			input.setAttribute("autocomplete", "off");

			field.append(label, input);
			playerInfo.appendChild(field);

			for (let i = 0; i < tokenCount; ++i) {
				const tokenBtn = document.createElement("button");
				tokenBtn.setAttribute("type", "button");
				tokenBtn.classList.add("token-btn", "ui-border", "ui-btn");
				if (i == 0) {
					tokenBtn.textContent = tokenBtn.dataset.token = "x";
				} else {
					tokenBtn.textContent = tokenBtn.dataset.token = "o";
				}

				tokenBtn.addEventListener("click", handleTokenBtn);

				playerInfo.appendChild(tokenBtn);
			}

			menu.appendChild(playerInfo);
		}

		const startBtn = document.createElement("button");
		startBtn.classList.add("start-btn", "ui-border", "ui-btn");
		startBtn.textContent = "Start";

		const rule = document.createElement("p");
		rule.classList.add("game-rule");
		rule.textContent = gameRules[gameState.name];

		menu.append(startBtn, rule);

		menu.addEventListener("submit", handleStart);

		menuContainer.appendChild(menu);

		main.appendChild(menuContainer);
	};

	//CREATES THE MAIN MENU THAT CONTAINS THE GAME STATE BUTTONS
	let createMainMenu = () => {
		createMenuContainer();

		const mainMenu = document.createElement("div");
		mainMenu.classList.add("main-menu", "menu");

		const title = document.createElement("h2");
		title.textContent = "Choose a mode";

		const multiplayerBtn = document.createElement("button");
		multiplayerBtn.classList.add("game-btn", "ui-border", "ui-btn");
		multiplayerBtn.dataset.gameState = "multiplayer";
		multiplayerBtn.textContent = "Player vs Player";
		multiplayerBtn.addEventListener("click", handleGameBtn);

		const singleplayerBtn = document.createElement("button");
		singleplayerBtn.classList.add("game-btn", "ui-border", "ui-btn");
		singleplayerBtn.dataset.gameState = "singleplayer";
		singleplayerBtn.textContent = "Player vs Computer";
		singleplayerBtn.addEventListener("click", handleGameBtn);

		const rules = document.createElement("p");
		rules.classList.add("game-rule");
		rules.textContent =
			"Click on the empty spots to make your move on a 3x3 grid. A player has one turn to click. " +
			"First player to place 3 consecutive pieces diagonally, horizontally or vertically wins.";

		mainMenu.append(title, multiplayerBtn, singleplayerBtn, rules);
		menuContainer.appendChild(mainMenu);

		main.appendChild(menuContainer);
	};

	//CREATE MENU ON START
	createMainMenu();
})();
