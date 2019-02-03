import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){

    let squareClasses = "square " 
                + (props.isWinSquare ? "winSquare"+props.value : "");

    return(
        <button className={squareClasses} onClick={props.onClick}>
            {props.value}
        </button>
    );
};


  
  class Board extends React.Component {

    renderSquare(squareNumber, isWinSquare) {
      return (
      <Square 
        value={this.props.squares[squareNumber]}
        onClick={()=> this.props.onClick(squareNumber)}
        isWinSquare = {isWinSquare}
        />
      );
    }
  
    render() {     

        let squares = [];
        let row = [];
        let currentSquareNumber = 0;
        let isWinSquare = false;

        for(let y=1;y<=3;y++){//rows
            row = [];
            for(let x = 1; x<=3;x++){//columns

                if(this.props.squares.winningSquares)
                    isWinSquare = (this.props.squares.winningSquares.includes(currentSquareNumber)?true:false);

                row.push(this.renderSquare(currentSquareNumber, isWinSquare));
                currentSquareNumber++;

            }
            squares.push(<div key={currentSquareNumber} className="board-row">{row}</div>);
        }


      return (
        <div>
            {squares}
        </div>
      );
    }
    /*
     <div className="board-row" key="0">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row" key="1">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row" key="2">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
    */
  }
  
  class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                    squares:Array(9).fill(null),
                    squareNumber:null,//the square's assigned value number. Easy to figure out row and column this way based on the board size.
                }
            ],
            stepNumber:0,
            xIsNext:true,
            sortAscending:true,
            numberOfRows: 3,
            numberOfCols:3
        }

    }

    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X':'O';
        this.setState({
            history:history.concat([{
                squares:squares,
                squareNumber:i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step % 2) ===0.
        });
    }

    resetGame(){
        this.setState({
            stepNumber:0,
            history: [{
                    squares:Array(9).fill(null),
                    squareNumber:null,
                }],
            xIsNext:true,
        });
    }

    toggleSortOrder(){
        this.setState({
            sortAscending: !this.state.sortAscending
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let nextSortOrder = "";
        const moves = history.map((step,move)=>{

            //Get the row and column, starts top left at 0,0. Add 1 for user's help
            const row = Math.floor(step.squareNumber/this.state.numberOfRows)+1;//the whole number represents the row
            const col = step.squareNumber % this.state.numberOfCols+1;//the remainder represents which column
            let classes ='';

            //Add a CurrentMove class if the history button is the latest one
            if(move == this.state.stepNumber){
                classes = 'CurrentMove';
            }

            const desc = move?
            'Go to move #' + move + ' ('+col+','+row+')':
            'Go to game start';

            return (
                <li key={move}>
                    <button className={classes} onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            )

        });

        let status;
        if(winner){
            status = 'Winner: '+winner.winnerSymbol;
            current.squares.winningSquares = winner.winnerLine;//pass the squares that won
        }
        else{
          status = 'Next player: '+(this.state.xIsNext ? 'X': 'O');
        }

        if(!this.state.sortAscending){//if we are not in ascending order, need to flip the order
            moves.sort(function(a,b){
                return b.key - a.key;
            })
            nextSortOrder = "Ascending "
        }
        else{
            nextSortOrder = "Descending"
        }

      return (
        
        <div className="game">
          <div className="game-board">
          <button onClick={() =>this.resetGame()}>Reset Game</button>
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() =>this.toggleSortOrder()}>Sort {nextSortOrder}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  

  function calculateWinner(squares){
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

      for(let i = 0; i <lines.length; i++){
          const [a,b,c] = lines[i];
          if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return ({winnerSymbol: squares[a], 
                    winnerLine: lines[i]});//return the 3 winner #'s and the line it was on
      }
      return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  