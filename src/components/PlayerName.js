import React from 'react';

class PlayerName extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            guess: '',
            guesses: [],
    };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);

    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState ({
            [name]: value,
        })
        console.log(value);
    }

    handleSubmit = (e) => {
        console.log('hello from handleSubmit')
        console.log('player name from parent', this.props.playerName)
        e.preventDefault();
        console.log(this.state)
        let playerGuess = this.state.guess.toLowerCase();
        let answer = this.props.playerName.toLowerCase();
        console.log(playerGuess);
        console.log(answer) ;
        if (playerGuess === answer) {
            console.log('correct answer');
            this.setState({
                guess: '',
            })
            this.props.setGameState();
            this.props.updateScore('correct');
        }
        else {
            console.log('your answer is wrong');
            this.setState({
                guess: '',
            })
            this.state.guesses.push(playerGuess)
        }
    }


    // NEXT STEP

    /*****
     Once the player selects 'play again', how can the div below switch to the original display?

     ****/
    render () {
      const rows = this.state.guesses.map((row, index) => {

        return (
          <p key={index}>Guess {index + 1}: {row}</p>
        )
      })
            return (
            <>
            <div className="flex">
              <div>
                <h3>Guesses Made</h3>
                <p>{rows}</p>
              </div>
                <div>
                    <form>
                        <input type="text" placeholder="Who is it?" name="guess" value={this.state.guess} onChange={this.handleChange} />
                        <button type="submit" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
            </>
            )
        }
    }

export default PlayerName;
