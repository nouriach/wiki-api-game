import React from 'react'
import Content from './Content'

class FetchData extends React.Component {
  constructor(props) {
    super(props);

    const items = [];

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      playerName: [],
      guess: ''
    };
  }


  newPlayer = () => {
    //remove all content class elements
    document.querySelectorAll('.content').forEach(e => e.remove());
    //fetch new player TODO: Call an actual new player rather than repeat Alan Shearer over and over
    this.fetchData();
  }

  fetchData = (event) => {
    let oldBtn = document.getElementById('newGame')
    oldBtn.setAttribute('class','hidden')

    let newBtn = document.getElementById('newPlayer')
    newBtn.setAttribute('class','btn')
        // fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Alan%20Shearer')
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=Alan%20Shearer&format=json&prop=wikitext&section=0')
        .then(res => res.json())
        .then(json => {

            this.setState({
              isLoaded: true,
              items: json.parse.wikitext['*'],
              playerName: json.parse.title
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }




    setDate = (timeAtClub) => {
      let dateContainer = document.createElement("div");
      dateContainer.setAttribute('class', 'content');
      let dateElement = document.createElement("p");
      dateElement.setAttribute('class', 'datesPlayed');
      dateElement.innerHTML = timeAtClub;
      document.getElementById('date').appendChild(dateContainer)
      dateContainer.appendChild(dateElement);
    }


    handleChange = event => {
      const { name, value } = event.target

      this.setState({
        [name]: value,
      })
    }
    render() {
      const { error, isLoaded, items, guess } = this.state;


      //remove all characters that are not 0-9 or a-z
      var outString = items.toString().replace(/[^\w\s]/gi, '')

      //split entire array by words
      var split = outString.toString().split(' ');

      console.log(split)
      //remove all blank spaces in array
      Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
          }
        }
        return this;
      };

      let test = split.clean("");

      // loop through array to find clubs that are relevant to wiki page
      for (var i = 0; i < split.length; i++) {
          //if club is youth or manager club then do not include
          if (split[i].includes('clubs')) {
              if (split[i].includes('youth') || split[i].includes('manager')) {
                console.log('this is a youth club = ' + i)
              } else {
                //split the date into two separate variables containing start year and end year
                let date = split[i - 1]
                //sometimes the dates are 9 characters long as of an arrow being visible
                //this will make all of the dates become maximum 8 characters long
                date = date.substring(0, 8)

                if (date.length < 8) {
                  date = 'Present Club'
                  let timeAtClub = date;
                  this.setDate(timeAtClub)
                } else {
                  let startYear = date.substring(0, date.length - 4)
                  console.log('date starting : ' + startYear)

                  let endYear = date.substring(4, date.length + 4)
                  console.log('date ending : ' + endYear)

                  let timeAtClub = startYear + ' - ' + endYear
                  console.log('time at club = ' + startYear + ' - ' + endYear)

                  this.setDate(timeAtClub)

                }


                //create a container for the teams to show in
                let teamContainer = document.createElement("div");
                //set the container to have a generic class of 'content'
                teamContainer.setAttribute('class', 'content');

                //create a p tag to insert team into
                let teamElement = document.createElement("p");

                //If the first name of the team is repeated in the second name
                //(EG: Southampton FCSouthampton for Alan Shearer) only show the first team name
                if (split[i + 2].includes(split[i + 1])) {
                  teamElement.innerHTML = split[i + 1];
                } else {
                  teamElement.innerHTML = split[i + 1] + ' ' + split[i + 2];
                }

                //Append the new div with the team Name
                teamContainer.appendChild(teamElement)
                //Append the main div with the new container
                document.getElementById('team').appendChild(teamContainer);


              }
          }
      }

      //loop entire array to find caps/appearances from player in the wiki page
      for (var i = 0; i < split.length; i++) {
          if (split[i].includes('caps')) {
            //if the caps id contains total, sport, or national do not include
            if (split[i].includes('total') || split[i].includes('national')) {
              console.log('These caps do not count')
            } else if (split[i].includes('sport') || (split[i] === 'caps')) {
              console.log('These caps do not count')
            } else if (split[i] === null) {
              console.log(split[i] + ' THIS IS NOT HERE')
            } else {
              //create appearances container
              let appearancesContainer = document.createElement("div");
              //give container a generic class
              appearancesContainer.setAttribute('class', 'content');
              //create new p element and append to appearences div
              let appearances = document.createElement("p");
              appearances.innerHTML = split[i + 1];

              //append the new container with the new appearances
              appearancesContainer.appendChild(appearances)

              //append the main div with the container
              document.getElementById('appearances').appendChild(appearancesContainer);
            }
          }
        }

        //loop entire array to find goals scored by player in wiki page
        for (var i = 0; i < split.length; i++) {
            if (split[i].includes('goals')) {
              //if the goals id contains total, national, goalsto, ref, or total goals, then do not includes
              //if the id equals goals do not include
              if (split[i].includes('total') || split[i].includes('national')) {
                console.log('These goals do not count')
              } else if (split[i].includes('goalsto') || split[i].includes('ref')) {
                console.log('These goals do not count')
              } else if (split[i].includes('totalgoals') || split[i] === 'goals') {
                console.log('These goals do not count')
              } else if (split[i].includes('topflight')) {
                console.log('These goals do not count')
              } else {
                  //create container for goals
                  let goalsContainer = document.createElement("div");
                  //set generic class to container
                  goalsContainer.setAttribute('class', 'content');
                  //create a new p element to append goals into goals div
                  let goals = document.createElement("p");
                  goals.innerHTML = split[i + 1];

                  //append the container with goals scored
                  goalsContainer.appendChild(goals)
                  document.getElementById('goals').appendChild(goalsContainer);
              }
            }
          }

        return (
        <>
          <div id="container">
          <button className="btn" id="newGame" onClick={this.fetchData}>Random Player</button>
          <button className="hidden" id="newPlayer" onClick={this.newPlayer}>New Player</button>
            <h2 className="spoiler">{this.state.playerName}</h2>
            <div className="playerContainer">
              <div id="date">
                <h4>Dates Played</h4>
              </div>
              <div id="team">
                <h4>Team Name</h4>
              </div>
              <div id="appearances">
                <h4>Appearances Made</h4>
              </div>
              <div id="goals">
                <h4>Goals Scored</h4>
              </div>
            </div>
          </div>
          // I tried to make an input to guess in but for some reason whenever it is typed into
          // it re does the entire api call?????
          <input
          type="text"
          value={guess}
          name="guess"
          onChange={this.handleChange}
          />
        </>
        )
    }
}

export default FetchData;
