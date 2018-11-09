import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/*
an ability to undo and redo certain actions is a common requirement in applications.
Avoiding direct data mutation lets us keep previous versions of the game’s history intact, and reuse them later.
Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.
 */


/*
The Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they’re clicked.
In React terms, the Square components are now controlled components.
 */

/*
Function Components - are a simpler way to write components that only contain a render method and don’t have their own state.
Instead of defining a class which extends React.Component, we can write a function that takes props as input and returns what should be rendered.
we also changed onClick={() => this.props.onClick()} to a shorter onClick={props.onClick}
In a class, we used an arrow function to access the correct this value, but in a function component we don’t need to worry about this.
*/
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    // Since state is considered to be private to a component that defines it, we cannot update the Board’s state directly from Square.
    // we’ll pass down a function from the Board to the Square
    // we’re passing down two props from Board to Square: value and onClick.
    // The onClick prop is a function that Square can call when clicked. We’ll make the following
    renderSquare(i) {
        return (
            // Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    // To collect data from multiple children, or communicate with each other, you need to declare the shared state in their parent component.
    // The parent component can pass the state back down to the children by using props. Keeps the child components in sync with each other and with the parent
    // xIsNext (a boolean) will be flipped to determine which player goes next and the game’s state will be saved.
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    render() {
        const history = this.state.history;
        // always rendering the last move to rendering the currently selected move according to stepNumber
        const current = history[this.state.stepNumber];
        // check if a player has won
        const winner = calculateWinner(current.squares);

        // we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    // convention to use on[Event] names for props which represent events and handle[Event] for the methods which handle the events.
    handleClick(i) {
        //This ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // check if a player has won
        // Immutability => .slice() to create a copy of the squares array to modify instead of modifying the existing array.
        const squares = current.squares.slice();
        //ignoring a click if someone has won the game or if a Square is already filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // Unlike the array push() method you might be more familiar with, the concat() method doesn’t mutate the original array, so we prefer it.
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            // by adding stepNumber: history.length This ensures we don’t get stuck showing the same move after a new one has been made.
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    //update that stepNumber. We also set xIsNext to true if the number that we’re changing stepNumber to is even.
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
