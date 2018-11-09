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
class Square extends React.Component {
    // // To “remember” that it got clicked, and fill it with an “X” mark. To “remember” things, components use state.
    // // store the current value of the Square in this.state, and change it when the Square is clicked.
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         value: null,
    //     }
    // }
    render() {
        return (
            //onClick={() => CODE} equals onClick={() => CODE}
            // By calling this.setState from an onClick handler in the Square’s render method, we tell React to re-render that Square whenever its <button> is clicked.
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    // To collect data from multiple children, or communicate with each other, you need to declare the shared state in their parent component.
    // The parent component can pass the state back down to the children by using props. Keeps the child components in sync with each other and with the parent
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
        };
    }

    // convention to use on[Event] names for props which represent events and handle[Event] for the methods which handle the events.
    handleClick(i) {
        // Immutability => .slice() to create a copy of the squares array to modify instead of modifying the existing array.
            const squares = this.state.squares.slice();
        squares[i] = 'X';
        this.setState({squares: squares});
    }

    // Since state is considered to be private to a component that defines it, we cannot update the Board’s state directly from Square.
    // we’ll pass down a function from the Board to the Square
    // we’re passing down two props from Board to Square: value and onClick.
    // The onClick prop is a function that Square can call when clicked. We’ll make the following
    renderSquare(i) {
        return (
            // Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
