import React from 'react';
import PlayerClubs from './PlayerClubs';
import PlayerYears from './PlayerYears';
import PlayerGames from './PlayerGames';
import PlayerName from './PlayerName';
import PlayAgain from './PlayAgain';
import PlayerAnswer from './PlayerAnswer';
import GiveUp from './GiveUp';
import Score from './Score';
import Countdown from  './Countdown';

class FetchData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerPool: [],

            randName: '',
            randPlayerClubs: [],
            randYears: [],
            randGames: '',

            won: false,

            score: 0,
            lives: '',
            incorrectAnswers: [],

            countdownMin: '',
            countdownSec: '60',

            gameState: 'newGame',

            isLoaded: false,
        };
    }

    setCountdownValue = (e) => {
        e.preventDefault();
        // turn string to number
        Number(e.target.value);
        document.getElementById('3min').classList.remove('active')
        document.getElementById('5min').classList.remove('active')
        document.getElementById('10min').classList.remove('active')
        e.target.className = "active"
        this.setState ({
            countdownMin: e.target.value - 1,
        })
    }

    setLivesValue = (e) => {
        e.preventDefault();
        Number(e.target.value);
        document.getElementById('easy').classList.remove('active')
        document.getElementById('medium').classList.remove('active')
        document.getElementById('hard').classList.remove('active')
        e.target.className = "active"
        this.setState ({
            lives: e.target.value,
        })
    }

    fetchPlayerData = () => {
        // CSS needs to occur here to show the user that they need to select a time and difficulty level
        if (this.state.countdownMin === '' && this.state.lives !== '') {
            alert('please select a time');
            return 
        } 
        if (this.state.lives === '' && this.state.countdownMin !== '') {
            alert('please select a difficulty')
            return
        } 
        if(this.state.countdownMin === '' && this.state.lives === '' ) {
            alert('please select a time and difficulty')
            return
        } else {
            fetch('https://v2-api.sheety.co/7f01a568513886dcd760b17376d01421/premierLeaguePlayers/sheet1')
            .then(response => response.json())
            .then(data => {
                    data = data.sheet1;
                    this.setState ({
                        playerPool: data,

                        randName: '',
                        randPlayerClubs: [],
                        randYears: [],
                        randGames: '',

                        gameState: 'progress',
                        score: 0,
                        isLoaded: true,
                    })
                this.selectRandomPlayer(this.state.playerPool);
                this.setCountdown();
            })
            .catch(err => console.error(err)
            )
        }
    }

    selectRandomPlayer = (players) => {
      let randomPlayerID = Math.floor((Math.random() * this.state.playerPool.length) + 1);
      let randomPlayer = this.state.playerPool[randomPlayerID];

      this.setState({
        randName: randomPlayer.name,
        randGames: randomPlayer.totalApps,
        randYears: `${randomPlayer.firstApp} - ${randomPlayer.lastApp}`,
        randPlayerClubs: randomPlayer.clubs.split(","),
      })
    }

    setCountdown = () => {
        this.myInterval = setInterval(()=> {
            let currentMin = this.state.countdownMin;
            let currentSec = this.state.countdownSec;
            if (currentSec > 0 && currentMin > 0) {
                let secDecrease = this.state.countdownSec - 1;
                this.setState({
                    countdownSec: secDecrease,
                })
            }
            else if (currentSec > 0 && currentMin === 0) {
                let secDecrease = this.state.countdownSec - 1;
                this.setState({
                    countdownSec: secDecrease,
                })
                document.getElementById('countdown-result').className = 'top-containerRed';
            }
            else if (currentSec === 0 && currentMin > 0){
                this.setState({
                    countdownMin: this.state.countdownMin - 1,
                    countdownSec: 59,
                })
            }
            else if (currentSec === 0 && currentMin === 0){
                console.log('time is up');
                    this.setState({
                    won: false,
                    gameState: 'gameOver',
                    })
            }
            else {
                // this needs to set a state which displays a summary of the player's last game
                // TODO: Find a way for this to not trigger when Restart Game is pressed.
                console.log('end of setCountdown function')
            }
        }, 1000)
    }
    // The below function will show the next random player when you answer a correct question
    nextPlayer = () => {
      this.setState({
        gameState: 'progress',

      })
      this.selectRandomPlayer();
    }

    // The below function will show when the game is over and a new game needs to begin
    resetGame = () => {
        this.setState({
          playerPool: [],
          randName: '',
          randPlayerClubs: [],
          randYears: [],
          randGames: '',
          won: false,
          score: 0,
          lives: '',
          incorrectAnswers: [],
          countdownMin: '',
          countdownSec: '60',
          gameState: 'newGame',
          isLoaded: false,
        })
        this.selectRandomPlayer();
      }
    setGameState = (e) => {
        this.setState ({
            gameState: 'correct',
        })
        if (e === "lost") {
          this.setState({
            gameState: 'gameOver',
          })
        }
    }

    updateScore = (answer) => {
        if (answer === "correct") {
        this.setState({
            score: this.state.score + 1,
            })
        }
    }

    render() {
        let { isLoaded, randName, randPlayerClubs, randYears, randGames, gameState, won} = this.state;

        if (!isLoaded && (gameState === "newGame")) {
            // this should all be a single component?
            return <>
                    <div className="loading-container">
                        <h1>Can you guess the player from the years they played, the appearances they made and the Premier League clubs they played for?</h1>
                        <div>
                            <p>How much time do you want?</p>
                            <div id="gameSpec-btn">
                                <button className="countdownButton" id="3min" onClick={this.setCountdownValue} value='3'>3 Min</button>
                                <button className="countdownButton" id="5min" onClick={this.setCountdownValue} value='5'>5 Min</button>
                                <button className="countdownButton" id="10min" onClick={this.setCountdownValue} value='10'>10 Min</button>
                            </div>
                        </div>
                        <div>
                            <p>Difficult level?</p>
                            <div id="gameSpec-btn">
                                <button className="difficultyButton" id="easy" onClick={this.setLivesValue} value='15'>Easy</button>
                                <button className="difficultyButton" id="medium" onClick={this.setLivesValue} value='10'>Medium</button>
                                <button className="difficultyButton" id="hard" onClick={this.setLivesValue} value='5'>Hard</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="button" onClick={this.fetchPlayerData}>Play</button>
                    </div>

                </>
        }

        else if (isLoaded && (gameState === "progress")) {
            return (
                <>
                    <div className="top-container">
                      <Score score={this.state.score}/>
                      <Countdown minutes={this.state.countdownMin} seconds={this.state.countdownSec} />
                    </div>
                    <div id="Results">
                        <PlayerClubs clubs={randPlayerClubs}/>
                        <PlayerYears years={randYears} />
                        <PlayerGames games={randGames} />
                    </div>
                    <div className="submit-container">
                        <PlayerName playerName={randName} gameState={this.state.gameState} setGameState={this.setGameState} updateScore={this.updateScore} remainingLives={this.state.lives} answers={this.state.incorrectAnswers}/>
                    </div>
                    <div className="play-container">
                        <GiveUp skipPlayer={this.setGameState} />
                    </div>
                </>
            )
        }

        else if (gameState === "correct") {
            return (
                <>
                    <div className="top-container">
                      <Score score={this.state.score}/>
                      <Countdown minutes={this.state.countdownMin} seconds={this.state.countdownSec} />
                    </div>
                    <div id="Results">
                        <PlayerClubs clubs={randPlayerClubs}/>
                        <PlayerYears years={randYears} />
                        <PlayerGames games={randGames} />
                    </div>
                    <div className="contentContainer nameResults-container">
                        <PlayerAnswer playerName={randName} />
                    </div>
                    <div className='play-container'>
                        <PlayAgain restartGame={this.nextPlayer} gameState={this.state.gameState} wording="Next Player" />
                    </div>
                </>
            )
        }
        else if (gameState === "incorrect") {
          return (
              <>
                <div className="top-container">
                    <Score score={this.state.score}/>
                    <Countdown minutes={this.state.countdownMin} seconds={this.state.countdownSec} />
                </div>
                <div id="Results">
                    <PlayerClubs clubs={randPlayerClubs}/>
                    <PlayerYears years={randYears} />
                    <PlayerGames games={randGames} />
                </div>
                <div className="contentContainer nameResults-container-wrong">
                    <h2>Try again</h2>
                    <PlayerAnswer playerName={randName} />
                </div>
                <div className='play-container'>
                    <PlayAgain restartGame={this.nextPlayer} />
                </div>
              </>
          )
        }
        else if (gameState === 'gameOver') {
            return (
                <>
                    <div>
                        <h3>Game Over</h3>
                    </div>
                    <div>
                        <Score score={this.state.score}/>
                    </div>
                    <div className='play-container'>
                        <PlayAgain restartGame={this.resetGame} />
                    </div>
                </>
            )
        }
        else if (won) {
          return (
          <>
            <h1>You Won!!</h1>
            <div>
                <button className="button" onClick={this.fetchPlayerData}>Restart</button>
            </div>
          </>
        )
        }
    }
}

export default FetchData;
