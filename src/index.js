import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import registerServiceWorker from './registerServiceWorker';



function Square(props) {
    return (
        <button style={props.style} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {

        let style=null;
        const winSquares=this.props.winSquares;
        if (winSquares && winSquares.includes(i)){
            style={color:'blue'}
        }

        return (
            <Square
                style={style}
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
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber:0
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber:history.length
        });
    }

    jumpTo(move){
        this.setState({stepNumber:move,xIsNext:move%2===0});
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);



        const moves = history.map((step, move) => {

            var previous=null;
            var dif=null;

            if (move) {
                previous=move-1;
                for (let i = 0; i < 9; i++) {
                    if (history[previous].squares[i] !== history[move].squares[i]) {
                        let row = Math.floor(i / 3);
                        let col = i % 3;
                        dif = [row, col];
                        break;
                    }
                }
            }

            const desc = move ?
                'Go to move #' + move + '[' + dif[0] + ',' + dif[1] + ']':
                'Go to game start';

            const activeMove=this.state.stepNumber;
            let style=null;
            if (move===activeMove){
                style={color:'blue'};
            }
            return (
                <li key={move}>
                    <button style={style} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        let winSquares=null;
        if (winner) {
            status = 'Winner: ' + winner.winner;
            winSquares=winner.winSquares;
        }
        else if (this.state.history.length===10){
            status = 'Draw';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winSquares={winSquares}
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
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {

    let width=3;
    let lines=[];
    for (let i=0;i<width;i++){
        let a=width*i;
        let line=[a,a+1,a+2];
        lines.push(line);
    }
    for (let i=0;i<width;i++){
        let line=[i,i+width,i+width*2];
        lines.push(line);
    }
    
    lines.push([0,width+1,2*(width+1)]);
    lines.push([2,width-1+2,2+2*(width-1)]);

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner:squares[a],winSquares:lines[i]};
        }
    }
    return null;
}


//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
