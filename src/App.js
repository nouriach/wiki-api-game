import React from 'react';
import logo from './logo.svg';
import './App.css';
import FetchData from './components/FetchData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Wiki Api Game
      </header>
      <FetchData />
    </div>
  );
}

export default App;
