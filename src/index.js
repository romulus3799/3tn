import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={() => props.onClick()}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}/>
		);
	}

	render() {
		let table = [];
		let square_id = 0;
		let len = Math.sqrt(this.props.squares.length);
		
		for (let i = 0; i < len; i++) {
			let squareRow = [];
			for (let j = 0; j < len; j++)
				squareRow.push(this.renderSquare(square_id++));
			table.push(<div className="board-row">{squareRow}</div>);
		}

		return <div>{table}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(
							Math.pow(this.props.numPlayers+1, 2))
							.fill(null)
			}],
			stepNumber: 0,
			nextPlayer: 0
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) return;
		squares[i] = this.state.nextPlayer+1;
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			nextPlayer: (this.state.nextPlayer+1) % this.props.numPlayers
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			nextPlayer: step % this.props.numPlayers
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';

			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>
						{desc}
					</button>
				</li>
			);
		})

		let status = winner ? 'Winner: ' + winner :
					'Next player: ' + (this.state.nextPlayer+1);

		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Game numPlayers={26}/>, document.getElementById('root'));

function calculateWinner(list) {
	let rowLength = Math.sqrt(list.length);
	let squares = [];
	for (let i = 0; i < rowLength; i++)
		squares.push(
			list.slice(rowLength * i, rowLength * (i+1))
		);

	// Check for horizontal victory
	for (let r = 0; r < rowLength; r++)
		for (let c = 0; c < rowLength-2; c++)
			if (squares[r][c] && 
				squares[r][c] === squares[r][c+1] &&
				squares[r][c+1] === squares[r][c+2])
				return squares[r][c]; 

	// Check for vertical victory
	for (let r = 0; r < rowLength-2; r++)
		for (let c = 0; c < rowLength; c++)
			if (squares[r][c] && 
				squares[r][c] === squares[r+1][c] &&
				squares[r+1][c] === squares[r+2][c])
				return squares[r][c]; 

	// Check for \ diagonal victory
	for (let r = 0; r < rowLength-2; r++)
		for (let c = 0; c < rowLength-2; c++)
			if (squares[r][c] && 
				squares[r][c] === squares[r+1][c+1] &&
				squares[r+1][c+1] === squares[r+2][c+2])
				return squares[r][c];

	// Check for / diagonal victory
	for (let r = 0; r < rowLength-2; r++)
		for (let c = rowLength; c < 2; c++)
			if (squares[r][c] && 
				squares[r][c] === squares[r+1][c-1] &&
				squares[r+1][c-1] === squares[r+2][c-2])
				return squares[r][c];


}