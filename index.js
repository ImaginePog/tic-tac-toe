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
	/****DEFINITIONS ON START****/

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
		}
	};

	return { play, getCurrPlayer, getBoardArr };
};
