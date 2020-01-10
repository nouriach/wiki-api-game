import React from 'react';
import PlayerClubs from './PlayerClubs';
import PlayerYears from './PlayerYears';
import PlayerGames from './PlayerGames';
import PlayerName from './PlayerName';
import PlayAgain from './PlayAgain';
import PlayerAnswer from './PlayerAnswer';
import GiveUp from './GiveUp';

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

            gameState: false,

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
                })
            this.removeDataGaps(this.state.playerPool);
        })
        .catch(err => console.error(err)
        )
    }

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
        gameState: false,
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
        console.log('footballer option', footballerOption);
        let footballerNew = randPlayer.toString().split(' ');
        // console.log('this is the full string', footballerOption);
        let i;
        for (i = 0; i < footballerOption.length; i++) {
            if (footballerOption[i].includes(footballerNew[1]) && (footballerOption[i-1].includes(footballerNew[0]) || footballerOption[i-2].includes(footballerNew[0]))) {
                console.log('player ID in data pool', i);

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
            console.log( array[i], 'there IS A space')
            array[i] = array[i].toString().replace(/.$/,'');
            console.log( array[i], 'there IS A space 2')

        }

        else {
            console.log( array[i], 'there is no space');
        }
        //
      }
    }

    loopClubs = (playerStr, playerId, playerName) => {

        let playerNameToStr = this.state.playerName.toString()
        console.log('recent string made', playerNameToStr);
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
        console.log(this.state)
    }

    setGameState = () => {
        console.log('Game State', this.state.gameState);
        this.setState ({
            gameState: true,
        })
        console.log('Game State Update', this.state.gameState);

    }

    render() {
        let { isLoaded, randName, randPlayerClubs, randYears, randGames, gameState} = this.state;
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

        else if (isLoaded && !gameState) {
            return (
                <>
                    <div id="Results">
                        <PlayerClubs clubs={randPlayerClubs}/>
                        <PlayerYears years={randYears} />
                        <PlayerGames games={randGames} />
                    </div>
                    <div className="submit-container">
                        <PlayerName playerName={randName} gameState={this.state.gameState} setGameState={this.setGameState}/>
                    </div>
                    <div className="play-container">
                        <GiveUp sendFunction={this.setGameState} />
                    </div>
                </>
            )
        }

        else if (gameState) {
            return (
                <>
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
    }
}

export default FetchData;
