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
            playerName: '',
            playerData: [],
            playerClubs: [],
            playerYears: [],
            playerGoals: [],
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
            this.updatePlayer(this.state.playerPool);
        })
        .catch(err => console.error(err)
        )
    }

    updatePlayer = (d) => {
        let playerFname;
        let playerLname;
        let nameIdArray = [];
        let split = d.toString().split('|');
        let i;
        for (i = 0; i < split.length; i++) {
            if (split[i].includes('sortname')) {
                nameIdArray.push(i);
            }
            else {
            }
        }
        console.log('outside of loop');
        let randId = nameIdArray[Math.floor(Math.random()*nameIdArray.length)];

        playerFname = split[randId + 1].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');;
        playerLname = split[randId + 2].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
       this.fetchData(playerFname, playerLname);
    }

    fetchData = (a, b) => {
        let link = `https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=${a}%20${b}&format=json&prop=wikitext&section=0`;
        fetch(link)
        .then(response => response.json())
        .then(data => {
            console.log(link);
            if (!data.parse.wikitext['*'].includes('clubs1')) {
                this.fetchPlayerData();            
                }
            else {

                this.setState ({
                    isLoaded: true,
                    playerName: data.parse.title,
                    playerData: data.parse.wikitext['*'],
                    playerClubs: [],
                    playerYears: [],
                    playerGoals: [],
                    playerGames: [],
                    })
                }
            })
        .catch(err => console.error(err)
        )
    }

    render() {
        let { isLoaded, playerName, playerData, playerClubs, playerYears, playerGoals, playerGames } = this.state;

        let sliceStrStart = playerData.indexOf("years1 ");
        let sliceStrEnd = playerData.indexOf("totalcaps");
        this.state.playerClubs = playerData.slice(sliceStrStart, sliceStrEnd)
        let split = this.state.playerClubs.toString().split(' ');
        let clubsArray = [];
        let yearsArray = [];
        let goalsArray = [];
        let gamesArray = [];

        let i;
        for (i = 0; i < split.length; i++) {
            if  (split[i] == "") {
                split.splice(i,1);
                i--;
            }
            else if (split[i].includes('clubs') & !split[i].includes('youth'))  {
                let club = split[i + 2].replace(/[^a-z^A-Z^0-9→\^]/gi, '');
                let clubTwo = split[i + 3].replace(/[^a-z^A-Z^0-9→\^]/gi, '');
                if(clubTwo.includes(club)) {
                    clubTwo = clubTwo.slice(0, (clubTwo.length - club.length));
                }
                let finalClub = club + ' ' + clubTwo;
                clubsArray.push(finalClub)
                this.state.playerClubs = clubsArray;
            }
        };

        let e;
        for (e = 1; e < split.length; e++) {
            if (split[e].includes('year') & !split[e].includes('youth') & !split[e].includes('national')){
                let yearsResult = split[e+2].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');;
                yearsArray.push(yearsResult);
                this.state.playerYears = yearsArray;
            } 
            else if (split[e].includes('goals') & !split[e].includes('youth') & !split[e].includes('national')) {
                let goals = split[e+2].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                goalsArray.push(goals);
                this.state.playerGoals = goalsArray;
            }
            else if (split[e].includes('caps') & !split[e].includes('national')){
                let games = split[e+2].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');;
                gamesArray.push(games);
                this.state.playerGames = gamesArray;
            }
        }
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