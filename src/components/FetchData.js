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
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (event) => {
        // fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Alan%20Shearer')
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&page=Alan%20Shearer&format=json&prop=wikitext&section=0')
        .then(res => res.json())
        .then(json => {

            this.setState({
              isLoaded: true,
              items: json.parse.wikitext['*']
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



    render() {
      let items = this.state.items

      var outString = items.toString().replace(/[[]|[|]|[]]/gi, '');

      var split = outString.toString().split(' ');

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


      console.log(split)

      for (var i = 0; i < split.length; i++) {
          if (split[i].includes('clubs')) {
              console.log(i)
              console.log(split[i + 1])
              console.log(split[i + 2])
              console.log(split[i + 3])
            let newElement = document.createElement("p");
            newElement.innerHTML = split[i + 2] + ' ' + split[i + 3];
            document.getElementById('Test').appendChild(newElement)
          }
      }


      let youthyears1 = items.indexOf('years2') + 1
      let youthyears2 = items.indexOf('years3') + 1

      let years1 = items.indexOf('years2', youthyears1)
      let years2 = items.indexOf('goals2', youthyears2)

      let club1 = items.slice(years1, years2)
      //
      // for (var i = 1; i < 5; i++) {
      //   let youthyears1=  items.indexOf('years' + i) + 1;
      //   let youthyears2 =  items.indexOf('years' + (i + 1)) + 1;
      //
      //   let playeryears1 = 'years' + i
      //   let playeryears2 = 'years' + (i + 1)
      //
      //   let years1 = items.indexOf(playeryears1, youthyears1)
      //   let years2 = items.indexOf(playeryears2, youthyears2)
      //
      //
      //   console.log('youth1 ' + youthyears1)
      //   console.log('youth2 ' + youthyears2)
      //   console.log('playeryears 1 ' + playeryears1)
      //   console.log('playeryears 2 ' + playeryears2)
      //   console.log('year 1 ' + years1)
      //   console.log('year 2 ' + years2)
      //   console.log('')
      //   console.log(club1)
      //   console.log('')
      // }


        return (
        <>
          <div id="Test">
          </div>
        </>
        )
    }
}

export default FetchData;
