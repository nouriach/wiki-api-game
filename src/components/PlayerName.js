import React from 'react';

class PlayerName extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            guess: '',
    };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState ({
            [name]: value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let playerGuess = this.state.guess.toLowerCase();
        let answer = this.props.playerName.toLowerCase();
        if (playerGuess === answer) {
            console.log('correct answer');
            this.setState({
                guess: '',
            })
            this.props.setGameState();
            this.props.updateScore('correct');
        }
        else {
            this.setState({
                guess: '',
            })
            this.props.answers.push(playerGuess)
            if (this.props.answers.length === this.props.remainingLives) {
              this.props.setGameState('lost')
            }
        }
    }


    // NEXT STEP

    /*****
     Once the player selects 'play again', how can the div below switch to the original display?
     ****/

    render () {
      const rows = this.props.answers.map((row, index) => {

        return (
          <p key={index}>Guess {index + 1}: {row}</p>
        )
      })

      let answers = this.props.answers.length;
            return (
            <>
            <div className="flex">
              <div>
                <h3>Total guesses used: {answers}/{this.props.remainingLives} </h3>
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
