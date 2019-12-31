import React from 'react';
import PlayerClubs from './PlayerClubs';
import PlayerYears from './PlayerYears';
import PlayerGoals from './PlayerGoals';
import PlayerGames from './PlayerGames';

class FetchData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerPool: [],
            playerName: [],
            playerClubs: [],
            playerYears: [],
            playerGames: [],
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

    removeDataGaps = (d) => {
        let allData = d.toString().split('|');
        let playerNameArray = [];
        let playerClubsArray = [];
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

        this.buildClubs(allData);
    }


    /**** NEXT STEP ****/
    // How do I join the string together again like below and then extract just the clubs?

    buildClubs = (e) => {
        let joinData = e.join()
        console.log(joinData);
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
                        <PlayerGoals goals={this.state.playerGoals} />
                        <PlayerGames games={this.state.playerGames} />
                    </div>
                </>
            )
        }
    }
}

export default FetchData;