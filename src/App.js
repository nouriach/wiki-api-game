import React from 'react';
import './App.css';
import FetchData from './components/FetchData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Who is the Premier League Footballer?</h2>
      </header>
      <div class='game-container'>
        <FetchData />
      </div>
    </div>
  );
}

export default App;
