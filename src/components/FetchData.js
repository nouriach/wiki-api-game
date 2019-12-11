import React from 'react'
import PlayerClubs from './PlayerClubs'

/***** 
 https://en.wikipedia.org/w/api.php?action=parse&page=Alan%20Shearer&format=jsonfm&prop=wikitext&section=17
 This is the table of his entire career.
 
 https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=Thierry%20Henry&format=jsonfm&prop=wikitext&section=0
 This brings the career table

Object.keys(data.parse.wikitext)

*/

class FetchData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.fetchData();
    }

    fetchData = () => {
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=Will%20Grigg&format=json&prop=wikitext&section=0')
        .then(response => response.json())
        .then(data => {
            this.setState ({
                isLoaded: true,
                playerName: data.parse.title,
                playerData: data.parse.wikitext['*'],
                playerClubs: [],
                playerYears: [],
                playerGoals: [],
                playerGames: [],
            })
            this.updatePlayer(this.state.playerData);
        })
        .catch(err => console.error(err)
        )
    }

    updatePlayer = (d) => {
        console.log('test', d)
    }


    render() {
        let { isLoaded, playerName, playerData, playerClubs, playerYears, playerGoals, playerGames } = this.state;

        let sliceStrStart = playerData.indexOf("years1 ");
        let sliceStrEnd = playerData.indexOf("totalcaps");

        this.state.playerClubs = playerData.slice(sliceStrStart, sliceStrEnd)
        console.log('playerClubs state below' , playerClubs);

        let split = this.state.playerClubs.toString().split(' ');
        console.log('split below' , split);

        console.log('full state below' , this.state);
        let clubsArray = [];

        let i;
        for (i = 0; i < split.length; i++) {
            if (split[i].includes('clubs')) {
                let club = split[i + 2].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                let clubTwo = split[i + 3].replace(/[[`~!@#$%^&*()=_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                let finalClub = club + ' ' + clubTwo;
                clubsArray.push(finalClub)
                this.state.playerClubs = clubsArray;
            }
            else if (split[i] == "") {
                split.splice(i,1);
                i--;
            }
        };

   

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
                        <p>Player Data: <span>{this.state.playerData}</span></p>
                        <PlayerClubs clubs={this.state.playerClubs}/>
                        <h4>Player Years: <span>{this.state.playerYears}</span></h4>
                        <h4>Player Goals: <span>{this.state.playerGoals}</span></h4>
                        <h4>Player Games: <span>{this.state.playerGames}</span></h4>
                    </div>
                </>
            )
        }
    }
}

export default FetchData;