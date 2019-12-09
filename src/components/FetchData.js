import React from 'react'


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
            isLoaded: false,
        };
    }    
    
    componentDidMount = () => {
        this.fetchData();
    }

    fetchData = () => {
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=Alan%20Shearer&format=json&prop=wikitext&section=0')
        .then(response => response.json())
        .then(data => 
            this.setState ({
                isLoaded: true,
                playerName: data.parse.title,
                playerData: data.parse.wikitext['*'],
            })
            )
        .catch(err => console.error(err)
        )
    }

    render() {
        let { isLoaded, playerName, playerData } = this.state;
        console.log(this.state.playerName)
        console.log(this.state.playerData)

        let history = this.state.playerData;
        let test = history.indexOf("years1 ");
        let testTwo = history.indexOf("totalcaps");

        let playerCareer = history.slice(test, testTwo)
        console.log(playerCareer);

        this.state.playerData = playerCareer;
        console.log(this.state.playerData);

        let split = history.toString().split(' ');
        
        let i;
        for (i = 0; i < split.length; i++) {
            if (split[i].includes('clubs')) {
                console.log(split);
                console.log (split[i])
                console.log (split[i + 2])
                console.log (i)
                console.log('in clubs')
                let newDiv = document.createElement("div");
                let newElement = document.createElement("p");
                newDiv.appendChild(newElement);
                newElement.innerHTML = split[i];
                console.log(newDiv)
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
                        <h1>hello</h1>
                        <p>{this.state.playerName}</p>
                        <p>{this.state.playerData}</p>
                    </div>
                </>
            )
        }
    }
}

export default FetchData;