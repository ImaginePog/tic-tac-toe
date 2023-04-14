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

	let getArr = () => {
		return boardArr;
	};

	let getPiece = (coords) => {
		return boardArr[coords.x][coords.y];
	};

	let isAvailable = (coords) => {
		return boardArr[coords.x][coords.y] === "";
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
			return;
		}

		if (!isAvailable(coords)) return;

		boardArr[coords.x][coords.y] = token;
		logBoard();
	};

	return { getArr, getPiece, place };
};

const Player = (name, token) => {
	let getName = () => name;
	let getToken = () => token;
};
