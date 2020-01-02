import React from 'react';
import PlayerClubs from './PlayerClubs';
import PlayerYears from './PlayerYears';
import PlayerGoals from './PlayerGoals';
import PlayerGames from './PlayerGames';
import { tsExportAssignment } from '@babel/types';
import { EBADMSG } from 'constants';

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
            isLoaded: false,
        };
    }    
    
    componentDidMount = () => {
        this.fetchPlayerData();
    }

    fetchPlayerData = () => {
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=List%20of%20Premier%20League%20players&format=json&prop=wikitext&section=1')
        .then(response => response.json())
        .then(data => {
                data = data.parse.wikitext['*'];
                this.setState ({
                    playerPool: data,
                })
            this.removeDataGaps(this.state.playerPool);
        })
        .catch(err => console.error(err)
        )
    }
    
    // A new API Call
        /**
          API brings in a list of every team to play in the Premier League.
          This will be used to cross reference with the original API call to extract
          every appearance of a club name. 
        ***/
    fetchClubList = () => {
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=List%20of%20Premier%20League%20clubs&format=json&prop=wikitext&section=1')
        .then (resp => resp.json())
        .then (clubs => {
                clubs = clubs.parse.wikitext['*'];
                this.setState ({
                    availableClubs: clubs,
                })
                this.buildClubs(this.state.availableClubs)
            })
        .catch(err => console.error(err)
        )
    }

    buildClubs = (teams) => {
        console.log('hello from build club');
        // New API call turned into an array
        let teamData = teams.toString().split('|');
        let finalTeamsArray = []
        let item;
        for (item = 0; item < teamData.length; item++) {
            if (teamData[item] == "") {
                // remove gaps in the array
                teamData.splice(item,1);
            }
            /****
             If a value includes 'F.C.' && is below a certain character length (longest team name)
             then it will be added to the finalTeamsArray.
             ***/ 
            else if (teamData[item].includes('F.C.') && (teamData[item].length < 33)) {
                let teamName = teamData[item].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                finalTeamsArray.push(teamName);
            }
        }
        this.storeClubs(finalTeamsArray)
    }

    storeClubs = (possibleTeams) => {
        /*****
        Clubs are now stored in an array without any gaps and with all special character removed
        This function needs: 
            to update the availableClubs state
            maybe seelct a random player ID number and bring in all of it's data from each state
            then identify the player and slice at a reasonable length away from the starting point
            then extract each club that appears in the availableClubs array
            then updated the state to then be displayed below in JSX
         ****/
        console.log('hello from possible teams');
        console.log(possibleTeams);

    };

    removeDataGaps = (d) => {
        let allData = d.toString().split('|');
        let playerNameArray = [];
        let playerYearsArray = [];
        let playerGamesArray = [];

        let i;
        for (i=0; i < allData.length; i++) {
            if (allData[i] === "" || allData[i].includes('sortname')) {
                // remove empty spaces
                allData.splice(i,1);
                i--;
            }
            else if (allData[i].includes('flagicon')) {
                // set player appearances
                let playerGames = allData[i+5]
                playerGamesArray.push(playerGames);
            }
            else if (allData[i].includes('align="left"')){
                // set player name
                let nameLoop = `${allData[i+2]} ${allData[i+3]}`;
                // set player career years
                let yearsLoop = `${allData[i-3]} - ${allData[i-2]}`
                playerNameArray.push(nameLoop);
                playerYearsArray.push(yearsLoop);
            }
        }
        /**** 
          Below each state array has the same amount of values in it, therefore
          number '30' will always represent the same player's information.
          PlayerClubs is still incomplete.
         ****/ 
        this.setState ({
            playerName: playerNameArray,
            playerClubs: [],
            playerYears: playerYearsArray,
            playerGames: playerGamesArray,
        })

        this.fetchClubList();
    }

    render() {
        let { isLoaded, playerName, playerData, playerClubs, playerYears, playerGoals, playerGames } = this.state;


        if (!isLoaded) {
            return (
                <p>Loading...</p>
            )
        }
        else {
            return (
                <>
                    <div id="Results">
                        <p>Name: <span>{this.state.playerName}</span></p>
                        <PlayerClubs clubs={this.state.playerClubs}/>
                        <PlayerYears years={this.state.playerYears} />
                        <PlayerGames games={this.state.playerGames} />
                    </div>
                </>
            )
        }
    }
}

export default FetchData;