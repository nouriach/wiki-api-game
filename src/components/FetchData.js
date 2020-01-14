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
            playerName: [],
            playerClubs: [],
            playerYears: [],
            playerGames: [],
            availableClubs: [],

            randName: '',
            randPlayerClubs: [],
            randYears: [],
            randGames: '',

            won: false,

            score: 0,
            
            countdownMin: 4,
            countdownSec: 59,

            gameState: 'progress',

            isLoaded: false,
        };
    }

    fetchPlayerData = () => {

        console.log('fetchPlayerData function');
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=List%20of%20Premier%20League%20players&format=json&prop=wikitext&section=1')
        .then(response => response.json())
        .then(data => {
                data = data.parse.wikitext['*'];
                this.setState ({
                    playerPool: data,
                    playerName: [],
                    playerClubs: [],
                    playerYears: [],
                    playerGames: [],
                    availableClubs: [],

                    randName: '',
                    randPlayerClubs: [],
                    randYears: [],
                    randGames: '',

                    gameState: 'progress',
                    score: 0,
                })
            this.removeDataGaps(this.state.playerPool);
            this.setCountdown();
        })
        .catch(err => console.error(err)
        )
    }

    setCountdown = () => {
        this.myInterval = setInterval(()=> {
            let currentMin = this.state.countdownMin;
            let currentSec = this.state.countdownSec;
            if (currentSec > 0 && currentMin >= 0) {
                let secDecrease = this.state.countdownSec - 1;
                this.setState({
                    countdownSec: secDecrease,
                })
            }
            else if (currentSec === 0 && currentMin > 0){
                this.setState({
                    countdownMin: this.state.countdownMin - 1,
                    countdownSec: 59,
                })
            }
            else {
                // this needs to set a state which displays a summary of the player's last game
                console.log('end of setCountdown function')
            }
        }, 1000)
    }


     // setCountdown = () => {
    //     let currentMin = this.state.countdownMin;
    //     let currentSec = this.state.countdownSec;
    //     console.log('Current Minute', currentMin);
    //     console.log('Current Second', currentSec);

    //     if (currentSec > 0 && currentMin > 0) {
    //         let secDecrease = this.state.countdownSec - 1;
    //         this.setState({
    //             countdownMin: 4,
    //             countdownSec: secDecrease,
    //           })
    //           console.log('New Minute', this.state.countdownMin);
    //           console.log('New Second', this.state.countdownSec);
    //     }
    //     else if (currentSec === 0 && currentMin > 0){
    //         let minDecrease = this.state.countdownSec - 1;
    //         this.setState({
    //             countdownMin: minDecrease,
    //             countdownSec: 59,
    //           })
    //           console.log('New Minute', this.state.countdownMin);
    //           console.log('New Second', this.state.countdownSec);
    //     }
    //     else {
    //         console.log('end of setCountdown function')
    //     }
    // }; 
    

    removeDataGaps = (playerPool) => {
        let playerPoolData = playerPool.toString().split('|');
        // the below arrays will eventually be asignd to the states
        let playerNameArray = [];
        let playerYearsArray = [];
        let playerGamesArray = [];

        let i;
        for (i=0; i < playerPoolData.length; i++) {
            if (playerPoolData[i] === "" || playerPoolData[i].includes('sortname')) {
                // remove empty spaces
                playerPoolData.splice(i,1);
                i--;
            }
            else if (playerPoolData[i].includes('flagicon')) {
                // set player appearances
                let playerGames = playerPoolData[i+5]
                playerGamesArray.push(playerGames);
            }
            else if (playerPoolData[i].includes('align="left"')){
                // set player name
                let nameLoop = `${playerPoolData[i+2]} ${playerPoolData[i+3]}`.replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                // set player career years
                let yearsLoop = `${playerPoolData[i-3]} - ${playerPoolData[i-2]}`
                playerNameArray.push(nameLoop);
                playerYearsArray.push(yearsLoop);
            }
        }
        //remove bad data at the start
        playerYearsArray.shift();
        /****
          Below each state array has the same amount of values in it, therefore
          number '30' will always represent the same player's information.
          PlayerClubs is still incomplete.
         ****/

        this.setState ({
            playerPool: playerPoolData,
            playerName: playerNameArray,
            playerClubs: [],
            playerYears: playerYearsArray,
            playerGames: playerGamesArray,
        })
        this.fetchClubList();
    }

    fetchClubList = () => {
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=List%20of%20Premier%20League%20clubs&format=json&prop=wikitext&section=1')
        .then (resp => resp.json())
        .then (clubs => {
                clubs = clubs.parse.wikitext['*'];
                this.setState ({
                    availableClubs: clubs,
                })
                this.cleanClubs(this.state.availableClubs)
            })
        .catch(err => console.error(err)
        )
    }

    resetGame = () => {
      this.setState({
        gameState: 'progress',
      })
      this.fetchClubList();
    }

    cleanClubs = (teams) => {
        // New API call turned into an array
        let teamData = teams.toString().split('|');
        let finalTeamsArray = []
        let value;
        for (value = 0; value < teamData.length; value++) {
            if (teamData[value] === "") {
                // remove gaps in the array
                teamData.splice(value,1);
            }
            /****
             If a value includes 'F.C.' && is below a certain character length (longest team name)
             then it will be added to the finalTeamsArray.
             ***/
            else if (teamData[value].includes('F.C.') && (teamData[value].length < 33)) {
                let teamName = teamData[value].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
                finalTeamsArray.push(teamName);
            }
        }
        //remove the incorrect team at the end
        finalTeamsArray.pop();
        this.setState ({
            availableClubs: finalTeamsArray,
        });
        this.storeClubs()
    }

    storeClubs = () => {
        //select a random player
        let randPlayer = this.state.playerName[Math.floor(Math.random()*this.state.playerName.length)];
        console.log('random player 1:', randPlayer);
        //find out what position in the array this player's ID is
        let randId = this.state.playerName.indexOf(randPlayer)

        let footballerOption = this.state.playerPool;
        let footballerNew = randPlayer.toString().split(' ');
        // console.log('this is the full string', footballerOption);
        let i;
        for (i = 0; i < footballerOption.length; i++) {
            if (footballerOption[i].includes(footballerNew[1]) && (footballerOption[i-1].includes(footballerNew[0]) || footballerOption[i-2].includes(footballerNew[0]))) {

                let sliceStart = footballerOption.indexOf(footballerOption[i]);
                let sliceEnd = sliceStart+15;
                // IF THE BELOW CONSOLE.LOGS DON'T SHOW CORRECTLY THEN THE PLAYER'S CLUBS CAN'T BE CREATED
                // console.log('index slice start:', sliceStart);
                // console.log('index slice end', sliceEnd);
                let newString = footballerOption.slice(sliceStart, sliceEnd);
                this.loopClubs(newString, randId, randPlayer);
            }
            else {
                console.log('lost player');
            }
        }
    }

    removeCharacters = (array) => {
      //loop through the array and remove the special characters and FC / AFC from each entry
      //Remove whitespace at front or back of string in each array entry

      let i
      for (i = 0; i < array.length; i++) {
        array[i] = array[i].toString().replace(/[[`~!@#$%^&*()=_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        array[i] = array[i].toString().replace(/ F.C./g, '');
        array[i] = array[i].toString().replace(/ F.C/g, '');
        array[i] = array[i].toString().replace(/A.F.C./g, '');
        array[i] = array[i].toString().replace(/^\s/, '');
        array[i] = array[i].toString().replace(/$\s/, '');

        if (array[i].toString().slice(-1) === ' ') {
            array[i] = array[i].toString().replace(/.$/,'');

        }

        else {
            console.log( array[i], 'there is no space');
        }
        //
      }
    }

    loopClubs = (playerStr, playerId, playerName) => {

        let playerNameToStr = this.state.playerName.toString()
        let randomPlayerClubs = [];
        let playerTeams = this.state.availableClubs;
        let playerTeamsStr = playerTeams.toString()
        let playerValue;
        //put the player string into an array that can be manipulated
        let playerStrSort = playerStr.toString().split(",")
        console.log(playerStrSort);

        //remove unwanted characters from playerStrSort array
        this.removeCharacters(playerStrSort)

        for (playerValue=0; playerValue < playerStrSort.length; playerValue++) {
            if (playerTeamsStr.includes(playerStrSort[playerValue])) {
                randomPlayerClubs.push(playerStrSort[playerValue]);
            }
        }
        //Make randomPlayerClubs an array that can be manipulated
        let playerClubList = randomPlayerClubs.toString().split(',')

        //Remove unwanted characters from playerClubList array
        this.removeCharacters(playerClubList)

        //Check if there are any arrays in the club list, create a new array that doesn't contain any duplicates
        let x;
        let playerClubsArray = [];
        for (x=0; x < playerClubList.length; x++) {
          if (!playerClubsArray.includes(playerClubList[x]) && !playerNameToStr.includes(playerClubList[x])) {
            playerClubsArray.push(playerClubList[x])
          }
          else {
            console.log('duplicate', x, playerClubList[x]);
          }
        }

        // console.log('loopClubs 4: this should be players clubs', playerclubStr)
        this.setState ({
            randPlayerClubs: playerClubsArray,
        })
        this.setPlayer(playerId, playerClubsArray)
    }

    /******
     * Function below displays all required info in the console.
     * Some times it fails to bring through the player's teams (may associated with the 'id' number issue
     * where the number ISN'T value+15 for some reason)
     **/
    setPlayer = (id, clubs) => {
        console.log('HELLO FROM SETPLAYER')
        // console.log('setPlayer 1 ID:', id)
        // console.log('setPlayer 2 clubs:', clubs)
        // console.log('setPlayer 3 name:', this.state.playerName[id]);
        // console.log('setPlayer 4 years:', this.state.playerYears[id]);
        // console.log('setPlayer 5 games:', this.state.playerGames[id]);
        this.setState ({
            randName: this.state.playerName[id],
            randPlayerClubs: clubs,
            randYears: this.state.playerYears[id],
            randGames: this.state.playerGames[id],
            isLoaded: true,

        })

        if (this.state.randName == " flagicon") {
          this.setState({
            randName: 'Gareth Barry'
        })
  }
}

    setGameState = (e) => {
        this.setState ({
            gameState: 'correct',
        })

        if (e === "lost") {
          this.setState({
            gameState: 'incorrect',
          })
        }
    }

    updateScore = (answer) => {
      if (answer === "correct") {
        this.setState({
          score: this.state.score + 1,
        })
        //if score is 5 or over 5 (to have a backup) then set the game to won.
            if (this.state.score >= 4) {
              this.setState({
                won: true,
                gameState: 'complete',
              })
            }
      }

    }



    render() {
        let { isLoaded, randName, randPlayerClubs, randYears, randGames, gameState, won} = this.state;
        //
        if (!isLoaded) {
            return <>
                    <div className="loading-container">
                        <h1>Can you guess the player from the years they played, the appearances they made and the Premier League clubs they played for?</h1>
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
                        <PlayerName playerName={randName} gameState={this.state.gameState} setGameState={this.setGameState} updateScore={this.updateScore}/>
                    </div>
                    <div className="play-container">
                        <GiveUp sendFunction={this.setGameState} />
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
                        <PlayAgain sendFunction={this.resetGame} />
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
                    <PlayAgain sendFunction={this.resetGame} />
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
