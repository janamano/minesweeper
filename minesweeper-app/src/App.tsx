import React from 'react';
import logo from './logo.svg';
import GameBoard from './GameBoard/GameBoard'
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <GameBoard />
    </div>
  );
}

export default App;
