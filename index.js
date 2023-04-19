const GameBoard = () => {
	/****DEFINITIONS ON START***/
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
	const board = GameBoard();

	let currPlayer = players[0];

	let checkWin = () => {};
	let switchPlayer = () => {
		if (currPlayer === players[0]) {
			currPlayer = players[1];
		} else {
			currPlayer = players[0];
		}
	};

	let getCurrPlayer = () => currPlayer;
	let getBoardArr = board.getBoardArr;

	let play = (coords) => {
		if (board.place(coords, currPlayer.getToken())) {
			checkWin();
			switchPlayer();
		}
	};

	return { play, getCurrPlayer, getBoardArr };
};
