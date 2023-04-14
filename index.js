const GameBoard = () => {
	//PROPERTIES DEFINITIONS
	let boardSize = 3;
	let boardArr = [];

	for (let i = 0; i < boardSize; ++i) {
		let rowArr = [];
		for (let j = 0; j < boardSize; ++j) {
			rowArr.push("");
		}
		boardArr.push(rowArr);
	}

	// PRIVATE FUNCTIONS
	let logBoard = () => {
		console.table(boardArr);
	};

	let getBoardArr = () => {
		return boardArr;
	};

	let getPiece = (coords) => {
		return boardArr[coords.y][coords.x];
	};

	let isAvailable = (coords) => {
		return boardArr[coords.y][coords.x] === "";
	};

	let isInBound = (coords) => {
		return (
			coords.x >= 0 &&
			coords.x <= boardSize &&
			coords.y >= 0 &&
			coords.y <= boardSize
		);
	};

	// PUBLIC FUNCTIONS
	let place = (coords, token) => {
		// let isInBound(coords);
		console.log(isInBound(coords));
		console.log(isAvailable(coords));

		if (!isInBound(coords)) {
			console.log("ERROR: OUT OF BOUNDS");
			return false;
		}

		if (!isAvailable(coords)) {
			alert("Spot taken");
			return false;
		}

		boardArr[coords.y][coords.x] = token;
		logBoard();
		return true;
	};

	return { getBoardArr, getPiece, place };
};

const Player = (name, token) => {
	let getName = () => name;
	let getToken = () => token;

	return { getName, getToken };
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
