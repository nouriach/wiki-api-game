import React from 'react';
import PlayerClubs from './PlayerClubs';
import PlayerYears from './PlayerYears';
import PlayerGames from './PlayerGames';
import PlayerName from './PlayerName';
import PlayAgain from './PlayAgain'

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
        /*****
        Clubs are now stored in an array without any gaps and with all special characters removed
        This function needs: 
            to update the availableClubs state
            maybe seelct a random player ID number and bring in all of it's data from each state
            then identify the player and slice at a reasonable length away from the starting point
            then extract each club that appears in the availableClubs array
            then updated the state to then be displayed below in JSX
         ****/
        //select a random player
        let randPlayer = this.state.playerName[Math.floor(Math.random()*this.state.playerName.length)];
        //find out what position in the array this player's ID is
        let randId = this.state.playerName.indexOf(randPlayer)
        let selectedFootballer = this.state.playerName[randId];
        let footballerOption = this.state.playerPool;

        let footballerNew = selectedFootballer.toString().split(' ');
        console.log('this is the full string', footballerOption);
        let i;
        for (i = 0; i < footballerOption.length; i++) {
            if (footballerOption[i].includes(footballerNew[1])) {
                // console.log('random player', randPlayer);
                // console.log('random id', randId);
                // console.log('second name of random player', footballerNew[1]);
                // console.log('string start', (footballerOption[i]));
                // console.log('string end', footballerOption[i+15]);

                let sliceStart = footballerOption.indexOf(footballerOption[i]);
                let sliceEnd = sliceStart+15;
                // IF THE BELOW CONSOLE.LOGS DON'T SHOW CORRECTLY THEN THE PLAYER'S CLUBS CAN'T BE CREATED
                // console.log('index slice start:', sliceStart);
                // console.log('index slice end', sliceEnd);
                let newString = footballerOption.slice(sliceStart, sliceEnd);
                this.loopClubs(newString, randId, randPlayer);
            }
            else {
            }
        }
    }

    loopClubs = (playerStr, playerId, playerName) => {
        // console.log('loopClubs 1: this should be reduced string', playerStr);
        // console.log('loopClubs 2: this should be the ID', playerId);
        // console.log('loopClubs 3: this should be the player name', playerName);

        let randomPlayerClubs = [];
        let playerTeams = this.state.availableClubs;
        let avClub;
        let playerValue;
        for (avClub=0; avClub < playerTeams.length; avClub++) {
            for (playerValue=0; playerValue < playerStr.length; playerValue++) {
                if (playerStr[playerValue].includes(playerTeams[avClub])) {
                    randomPlayerClubs.push(playerStr[playerValue]);
                }
            }
        }
        let playerclubStr = randomPlayerClubs.toString().replace(/[[`~!@#$%^&*()=_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        // console.log('loopClubs 4: this should be players clubs', playerclubStr)
        this.setState ({
            randPlayerClubs: playerclubStr,
        })
        this.setPlayer(playerId, playerclubStr)
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

    render() {
        let { isLoaded, randName, randPlayerClubs, randYears, randGames} = this.state;
        
        if (!isLoaded) {
            return <>
                    <div>
                        <p className="result">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium</p>
                        <button className="button" onClick={this.fetchPlayerData}>Play</button>
                    </div>
                </>
        }
        else {
            return (
                <>
                    <div id="Results">
                        <PlayerClubs clubs={randPlayerClubs}/>
                        <PlayerYears years={randYears} />
                        <PlayerGames games={randGames} />
                    </div>
                    <div>
                        <PlayerName name={randName}/>
                    </div>
                    <div className='play-container'>
                        <PlayAgain sendFunction={this.fetchPlayerData}/>
                    </div>
                </>
            )
        }
    }
}

export default FetchData;