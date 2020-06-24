import React from 'react';
import './App.css';
import FetchData from './components/FetchData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="appHeader">Who is the Premier League Footballer?</h1>
      </header>
      <div className='game-container'>
        <FetchData />
      </div>
    </div>
  );
}

export default App;
