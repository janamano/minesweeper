import React, { Component } from 'react'
import './GameBoard.css'
import { cellObject } from '../Typings/typings'

interface GameBoardStates {
    height: number,
    width: number
    numMines: number,
    board: cellObject[][]
}

class GameBoard extends Component<{}, GameBoardStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            height: 9,
            width: 9,
            numMines: 10,
            board: []
        }
    }
    componentDidMount() {
        this.initializeGame();
    }

    initializeGame = () => {
        // create cell array
        var allCells: cellObject[][] = [];
        for (var i = 0; i < this.state.height; i++) {
            // var currRow: 
            allCells.push([]);
            for (var j = 0; j < this.state.width; j++) {
                var currCell: cellObject = {
                    isMine: false,
                    numMinesAround: null,
                    revealed: false
                }
                allCells[i].push(currCell);
            }
        }
        console.log(allCells)
        // assign bombs
        var minesLeft = this.state.numMines
        while (minesLeft > 0) {
            let randX = Math.floor(Math.random() * this.state.width);
            let randY = Math.floor(Math.random() * this.state.height);
            if (allCells[randX][randY].isMine) {
                continue;
            }
            allCells[randX][randY].isMine = true;
            minesLeft--;
        }
        // assign numb values
        for (var i = 0; i < this.state.height; i++) {
            for (var j = 0; j < this.state.width; j++) {
                var currentCell: cellObject = allCells[i][j];
                currentCell.x = i
                currentCell.y = j
                if (currentCell.isMine) {
                    continue;
                }
                // tranverse one cell in all eigth directions
                var surroundingMines = 0;
                if (allCells[i-1]) {
                    if (allCells[i-1][j-1] && allCells[i-1][j-1].isMine) {
                        surroundingMines += 1
                    }
                    if (allCells[i-1][j] && allCells[i-1][j].isMine) {
                        surroundingMines += 1
                    }
                    if (allCells[i-1][j+1] && allCells[i-1][j+1].isMine) {
                        surroundingMines += 1
                    }
                }

                if (allCells[i][j-1] && allCells[i][j-1].isMine) {
                    surroundingMines += 1
                }
                if (allCells[i][j+1] && allCells[i][j+1].isMine) {
                    surroundingMines += 1
                }

                if (allCells[i+1]) {
                    if (allCells[i+1][j-1] && allCells[i+1][j-1].isMine) {
                        surroundingMines += 1
                    }
                    if (allCells[i+1][j] && allCells[i+1][j].isMine) {
                        surroundingMines += 1
                    }
                    if (allCells[i+1][j+1] && allCells[i+1][j+1].isMine) {
                        surroundingMines += 1
                    }
                }

                currentCell.numMinesAround = surroundingMines;  

            }
        }
        this.setState({
            board: allCells
        })
    }

    revealCells = (allCells: cellObject[][], i: number, j: number) =>  {
        if (allCells[i]) {
            if(allCells[i][j]) {
                if (!allCells[i][j].revealed && allCells[i][j].isMine) {
                    return allCells;
                } else if (!allCells[i][j].revealed && allCells[i][j].numMinesAround! > 0) {
                    allCells[i][j].revealed = true;
                    return allCells;
                } else if (!allCells[i][j].revealed && allCells[i][j].numMinesAround! === 0) {
                    allCells[i][j].revealed = true;
                    allCells = this.revealCells(allCells, i-1, j-1);
                    allCells = this.revealCells(allCells, i-1, j);
                    allCells = this.revealCells(allCells, i-1, j+1);
                    allCells = this.revealCells(allCells, i, j-1);
                    allCells = this.revealCells(allCells, i, j+1);
                    allCells = this.revealCells(allCells, i+1, j-1);
                    allCells = this.revealCells(allCells, i+1, j);
                    allCells = this.revealCells(allCells, i+1, j+1);
                    return allCells;
                }

            }
        }
        return allCells
    }

    evaluateClick = (cell: cellObject) => {
        if (cell.isMine) {
            alert("GAME OVER SON!")
        } else {
            var allCells = this.state.board;
            var i = cell.x!
            var j = cell.y!
            allCells = this.revealCells(allCells, i, j)
            this.setState({
                board: allCells
            })
        } 

    } 
    render() {
        var x = "X"
        return(
            <React.Fragment>
                <button type="button" className="btn btn-primary" onClick={()=>{this.initializeGame()}}>New Game</button>
                <div style={{marginLeft: "67rem", marginTop: "2rem"}}>
                    {this.state.board.map((row: cellObject[], key) => {
                        return(
                            <div style={{display: "flex"}}>
                                {row.map((cell: cellObject, cellKey) => {
                                    return (
                                        <button onClick={() => {this.evaluateClick(cell)}} type="button" className="btn btn-primary" style={{margin: "1px", padding: "1rem", border: "1px solid black"}}>
                                            {cell.revealed && cell.numMinesAround}
                                        </button>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }
}

export default GameBoard